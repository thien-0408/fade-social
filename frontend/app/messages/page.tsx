"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import FloatingNavbar from "@/components/FloatingNavbar";
import Sidebar from "@/components/Sidebar";
import {
  ActiveWhispers,
  ChatArea,
  DriftersNearby,
} from "./components";
import { ChatRoomData, ChatMessageData, getChatRooms } from "@/lib/chat";
import { getCurrentUserId } from "@/lib/user";
import { connectWebSocket, disconnectWebSocket } from "@/lib/websocket";

export default function MessagesPage() {
  const [rooms, setRooms] = useState<ChatRoomData[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatRoomData | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<ChatMessageData | null>(null);

  // Ref to track the latest selectedChat without re-subscribing WS
  const selectedChatRef = useRef(selectedChat);
  // eslint-disable-next-line react-hooks/refs
  selectedChatRef.current = selectedChat;

  // Load rooms and connect WebSocket on mount
  useEffect(() => {
    const userId = getCurrentUserId();
    setCurrentUserId(userId);

    if (!userId) return;

    getChatRooms().then(setRooms).catch(console.error);

    const disconnect = connectWebSocket(userId, (msg: ChatMessageData) => {
      setNewMessage(msg);

      // Update room list with new last message
      setRooms((prev) => {
        const updated = prev.map((room) => {
          if (room.chatId === msg.chatId) {
            return {
              ...room,
              lastMessage: msg.content,
              lastMessageTime: msg.timestamp,
            };
          }
          return room;
        });
        // Re-sort: rooms with messages first
        updated.sort((a, b) => {
          if (!a.lastMessageTime && !b.lastMessageTime) return 0;
          if (!a.lastMessageTime) return 1;
          if (!b.lastMessageTime) return -1;
          return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
        });
        return updated;
      });
    });

    return () => {
      disconnect();
      disconnectWebSocket();
    };
  }, []);

  const handleSelectChat = useCallback((room: ChatRoomData) => {
    setSelectedChat(room);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-[#ededed] overflow-hidden">
      <Sidebar />
      {/* Left Sidebar - Active Whispers */}
      <ActiveWhispers
        rooms={rooms}
        selectedChatId={selectedChat?.chatId ?? null}
        onSelectChat={handleSelectChat}
      />

      {/* Main Chat Area */}
      <ChatArea
        selectedChat={selectedChat}
        currentUserId={currentUserId}
        newMessage={newMessage}
      />

      {/* Right Sidebar - Widgets */}
      <div className="w-80 h-full bg-white dark:bg-[#0a0a0a] border-l border-gray-200 dark:border-white/5 p-6 flex flex-col overflow-y-auto custom-scrollbar">
        <DriftersNearby />
        
      </div>

      <div className="md:hidden">
        <FloatingNavbar />
      </div>
    </div>
  );
}
