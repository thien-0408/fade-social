"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import { ChatRoomData, ChatMessageData, getChatMessages } from "@/lib/chat";

interface ChatAreaProps {
  selectedChat: ChatRoomData | null;
  currentUserId: string | null;
  newMessage: ChatMessageData | null;
}

export default function ChatArea({ selectedChat, currentUserId, newMessage }: ChatAreaProps) {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevChatRef = useRef<string | null>(null);

  // Load messages when chat changes
  useEffect(() => {
    if (!selectedChat?.chatId) {
      setMessages([]);
      return;
    }

    // Reset if chat changed
    if (prevChatRef.current !== selectedChat.chatId) {
      prevChatRef.current = selectedChat.chatId;
      setMessages([]);
      setPage(0);
      setHasMore(true);
      loadMessages(selectedChat.chatId, 0, true);
    }
  }, [selectedChat?.chatId]);

  // Handle real-time incoming messages
  useEffect(() => {
    if (!newMessage || !selectedChat) return;
    if (newMessage.chatId !== selectedChat.chatId) return;

    // Avoid duplicates
    setMessages((prev) => {
      if (prev.some((m) => m.id === newMessage.id)) return prev;
      return [...prev, newMessage];
    });

    // Scroll to bottom for new messages
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, [newMessage, selectedChat?.chatId]);

  const loadMessages = useCallback(
    async (chatId: string, pageNum: number, isInitial: boolean) => {
      if (loading) return;
      setLoading(true);

      try {
        const result = await getChatMessages(chatId, pageNum, 20);
        const newMsgs = result.data;

        if (isInitial) {
          // Initial load: reverse so oldest at top, newest at bottom
          setMessages(newMsgs.reverse());
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
          }, 50);
        } else {
          // Infinite scroll: prepend older messages
          const scrollEl = scrollRef.current;
          const prevHeight = scrollEl?.scrollHeight ?? 0;

          setMessages((prev) => [...newMsgs.reverse(), ...prev]);

          // Maintain scroll position after prepending
          setTimeout(() => {
            if (scrollEl) {
              scrollEl.scrollTop = scrollEl.scrollHeight - prevHeight;
            }
          }, 50);
        }

        setHasMore(pageNum + 1 < result.totalPages);
        setPage(pageNum);
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  // Infinite scroll: load older messages when scrolling to top
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !hasMore || loading || !selectedChat) return;
    if (el.scrollTop < 100) {
      loadMessages(selectedChat.chatId, page + 1, false);
    }
  }, [hasMore, loading, selectedChat, page, loadMessages]);

  // Empty state
  if (!selectedChat) {
    return (
      <div className="flex-1 flex flex-col h-full relative bg-white dark:bg-[#0a0a0a] overflow-hidden">
        <div
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            color: "var(--pattern-color, #2e2e2e)" // In global css, we handle this
          }}
          className="absolute inset-0 opacity-[0.05] dark:opacity-20 pointer-events-none"
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-purple-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-400 mb-2">Select a conversation</h3>
            <p className="text-sm text-gray-500 dark:text-gray-600 max-w-xs">
              Choose a friend from the sidebar to start whispering
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full relative bg-white dark:bg-[#0a0a0a] overflow-hidden">
      {/* Background Pattern */}
      <div
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            color: "var(--pattern-color, #2e2e2e)"
          }}
          className="absolute inset-0 opacity-[0.05] dark:opacity-20 pointer-events-none"
      />

      <ChatHeader
        friendName={selectedChat.friendName}
        friendAvatar={selectedChat.friendAvatar}
        friendLastActiveAt={selectedChat.friendLastActiveAt}
      />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar relative z-0"
        onScroll={handleScroll}
      >
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        )}

        {/* No messages yet */}
        {messages.length === 0 && !loading && (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-600">
                No messages yet. Say hello to <span className="text-purple-400">{selectedChat.friendName}</span>!
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg.content}
            isMe={msg.senderId === currentUserId}
            avatar={
              msg.senderId !== currentUserId
                ? msg.senderAvatar
                  ? msg.senderAvatar.startsWith("http")
                    ? msg.senderAvatar
                    : `${msg.senderAvatar}`
                  : undefined
                : undefined
            }
            sender={msg.senderId !== currentUserId ? msg.senderName : undefined}
            time={new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        chatId={selectedChat.chatId}
        currentUserId={currentUserId}
        recipientId={selectedChat.friendId}
      />
    </div>
  );
}
