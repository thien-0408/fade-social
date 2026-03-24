"use client";

import Image from "next/image";

export type NotificationType = "like" | "reply" | "mention" | "faded";

interface NotificationItemProps {
  type: NotificationType;
  userName: string;
  message: string;
  timeAgo: string;
  avatarUrl?: string;
}

const badgeConfig: Record<NotificationType, { emoji: string; color: string }> = {
  like: { emoji: "❤️", color: "bg-pink-500" },
  reply: { emoji: "💬", color: "bg-blue-500" },
  mention: { emoji: "@", color: "bg-purple-500" },
  faded: { emoji: "👤", color: "bg-gray-600" },
};

export default function NotificationItem({
  type,
  userName,
  message,
  timeAgo,
  avatarUrl,
}: NotificationItemProps) {
  const badge = badgeConfig[type];
  const isFaded = type === "faded";

  return (
    <div
      className={`flex items-center gap-4 py-4 px-4 rounded-xl transition-all duration-200 hover:bg-white/[0.03] group ${
        isFaded ? "opacity-60" : ""
      }`}
    >
      {/* Avatar with badge */}
      <div className="relative flex-shrink-0">
        {avatarUrl ? (
          <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
            <Image
              src={avatarUrl}
              alt={userName}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#2A2A3E] border border-white/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
        {/* Badge overlay */}
        <div
          className={`absolute -bottom-1 -right-1 w-5 h-5 ${badge.color} rounded-full flex items-center justify-center text-[10px] border-2 border-[#0F0F1A]`}
        >
          {type === "mention" ? (
            <span className="text-white font-bold text-[9px]">@</span>
          ) : (
            <span className="text-[10px]">{badge.emoji}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-200">
          <span className="font-semibold text-white">{userName}</span>{" "}
          {message}
        </p>
        {type !== "faded" && (
          <p className="text-xs text-gray-500 mt-0.5 italic truncate">
            {getSubtext(type)}
          </p>
        )}
        {isFaded && (
          <p className="text-xs text-gray-500 mt-0.5">
            {message}
          </p>
        )}
      </div>

      {/* Time */}
      <span className="text-xs text-gray-500 flex-shrink-0">{timeAgo}</span>
    </div>
  );
}

function getSubtext(type: NotificationType): string {
  switch (type) {
    case "like":
      return "";
    case "reply":
      return "";
    case "mention":
      return "";
    default:
      return "";
  }
}
