import { apiFetch } from "./api";
import { getAccessToken } from "./auth";

/* ── Types ─────────────────────────────────────────────── */

export interface ChatRoomData {
  chatId: string;
  friendId: string;
  friendName: string;
  friendAvatar: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
  friendLastActiveAt?: string | null;
}

export interface ChatMessageData {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  recipientId: string;
  content: string;
  timestamp: string;
}

export interface PageResponse<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  data: T[];
}

/* ── API Calls ─────────────────────────────────────────── */

/** Fetch all chat rooms for the current user (includes empty rooms for friends) */
export async function getChatRooms(): Promise<ChatRoomData[]> {
  const token = getAccessToken();
  const res = await apiFetch<{ code: number; result: ChatRoomData[] }>("/chat/rooms", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.result || [];
}

/** Fetch paginated messages for a chat room (newest first) */
export async function getChatMessages(
  chatId: string,
  page = 0,
  size = 20
): Promise<PageResponse<ChatMessageData>> {
  const token = getAccessToken();
  const res = await apiFetch<{ code: number; result: PageResponse<ChatMessageData> }>(
    `/chat/rooms/${chatId}/messages?page=${page}&size=${size}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.result;
}

/** Get or create a chat room with a specific friend */
export async function getOrCreateRoom(friendId: string): Promise<string> {
  const token = getAccessToken();
  const res = await apiFetch<{ code: number; result: string }>(`/chat/${friendId}/room`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.result;
}
