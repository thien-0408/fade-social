"use client";

import { useState } from "react";
import { sendWsMessage } from "@/lib/websocket";
import { getOrCreateRoom } from "@/lib/chat";

interface ChatInputProps {
  chatId: string;
  currentUserId: string | null;
  recipientId: string;
}

export default function ChatInput({ chatId, currentUserId, recipientId }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim() || !currentUserId) return;

    // Ensure chatroom exists (creates if needed for first message)
    await getOrCreateRoom(recipientId);

    sendWsMessage(currentUserId, recipientId, message.trim());
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-white/5 relative z-20">
      <div className="relative flex items-center bg-white dark:bg-[#171717] rounded-full px-4 py-2 border border-gray-200 dark:border-white/5 focus-within:border-purple-500/50 dark:focus-within:border-purple-500/30 focus-within:ring-1 focus-within:ring-purple-500/20 transition-all shadow-sm dark:shadow-none">
        {/* Plus Button */}
        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/5">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>

        {/* Input */}
        <input
          type="text"
          placeholder="Whisper something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-gray-900 dark:text-gray-200 text-sm px-3 focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <button
            onClick={handleSend}
            className={`
              p-2 rounded-full transition-all duration-300
              ${message.trim()
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30 translate-x-0 opacity-100"
                : "bg-purple-600/50 text-white/50 cursor-not-allowed"
              }
            `}
            disabled={!message.trim()}
          >
            <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
