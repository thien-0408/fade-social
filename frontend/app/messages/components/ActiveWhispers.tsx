"use client";

import { useState } from "react";
import { ChatRoomData } from "@/lib/chat";
import { isOnline } from "@/lib/dateUtils";

interface ActiveWhispersProps {
  rooms: ChatRoomData[];
  selectedChatId: string | null;
  onSelectChat: (room: ChatRoomData) => void;
}

export default function ActiveWhispers({ rooms, selectedChatId, onSelectChat }: ActiveWhispersProps) {
  const [search, setSearch] = useState("");

  const filtered = rooms.filter((room) =>
    room.friendName.toLowerCase().includes(search.toLowerCase())
  );

  function formatTime(timestamp: string | null): string {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  }

  return (
    <div className="w-80 h-full bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-white/5 flex flex-col p-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Fade</h1>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search for a soul..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-100 dark:bg-[#171717] text-gray-900 dark:text-gray-300 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-600"
        />
        <svg
          className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="mb-2">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Active Whispers</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-600 text-sm">
            {rooms.length === 0 ? "Add friends to start whispering..." : "No results found."}
          </div>
        )}
        {filtered.map((room) => {
          const isSelected = selectedChatId === room.chatId;
          const hasMessage = !!room.lastMessage;

          return (
            <div
              key={room.chatId}
              onClick={() => onSelectChat(room)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                isSelected
                  ? "bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20"
                  : hasMessage
                  ? "bg-gray-50 dark:bg-[#1f1f22] hover:bg-gray-100 dark:hover:bg-[#252528]"
                  : "hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              <div className="relative">
                {room.friendAvatar ? (
                  <img
                    src={room.friendAvatar.startsWith("http") ? room.friendAvatar : `${room.friendAvatar}`}
                    alt={room.friendName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg">
                    {room.friendName.charAt(0).toUpperCase()}
                  </div>
                )}
                {room.friendLastActiveAt && isOnline(room.friendLastActiveAt) && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-[#0a0a0a]"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`font-medium truncate ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                    {room.friendName}
                  </span>
                  {room.lastMessageTime && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                      {formatTime(room.lastMessageTime)}
                    </span>
                  )}
                </div>
                <p className={`text-sm truncate ${
                  isSelected ? "text-purple-600 dark:text-purple-400" : room.lastMessage ? "text-gray-500" : "text-gray-400 dark:text-gray-700 italic"
                }`}>
                  {room.lastMessage || "Start a conversation..."}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
