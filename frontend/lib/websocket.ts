import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ChatMessageData } from "./chat";

let stompClient: Client | null = null;

/**
 * Connect to the WebSocket server and subscribe to the user's personal message queue.
 * @param userId - Current user's UUID
 * @param onMessage - Callback triggered when a new message arrives
 * @returns A disconnect function
 */
export function connectWebSocket(
  userId: string,
  onMessage: (message: ChatMessageData) => void
): () => void {
  if (stompClient?.active) {
    stompClient.deactivate();
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  stompClient = new Client({
    webSocketFactory: () => new SockJS(`${backendUrl}/ws`),
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    debug: (str) => {
      if (process.env.NODE_ENV === "development") {
        console.log("[STOMP]", str);
      }
    },
    onConnect: () => {
      console.log("[WS] Connected");

      // Subscribe to the user's personal message queue
      stompClient?.subscribe(
        `/user/${userId}/queue/messages`,
        (frame: IMessage) => {
          const msg: ChatMessageData = JSON.parse(frame.body);
          onMessage(msg);
        }
      );
    },
    onStompError: (frame) => {
      console.error("[WS] STOMP error", frame.headers["message"], frame.body);
    },
    onDisconnect: () => {
      console.log("[WS] Disconnected");
    },
  });

  stompClient.activate();

  return () => {
    stompClient?.deactivate();
    stompClient = null;
  };
}

/**
 * Send a chat message via WebSocket.
 */
export function sendWsMessage(senderId: string, recipientId: string, content: string) {
  if (!stompClient?.active) {
    console.warn("[WS] Not connected, cannot send message");
    return;
  }

  stompClient.publish({
    destination: "/app/chat.send",
    body: JSON.stringify({ senderId, recipientId, content }),
  });
}

/**
 * Disconnect the WebSocket client.
 */
export function disconnectWebSocket() {
  stompClient?.deactivate();
  stompClient = null;
}
