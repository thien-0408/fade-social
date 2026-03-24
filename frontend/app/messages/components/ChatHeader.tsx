"use client";

import { formatLastActive, isOnline } from "@/lib/dateUtils";

interface ChatHeaderProps {
  friendName: string;
  friendAvatar: string | null;
  friendLastActiveAt?: string | null;
}

export default function ChatHeader({ friendName, friendAvatar, friendLastActiveAt }: ChatHeaderProps) {
  const avatarSrc = friendAvatar
    ? friendAvatar.startsWith("http")
      ? friendAvatar
      : `${friendAvatar}`
    : null;

  const userIsOnline = isOnline(friendLastActiveAt);

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/5 bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="relative">
          {avatarSrc ? (
            <img src={avatarSrc} alt={friendName} className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm">
              {friendName.charAt(0).toUpperCase()}
            </div>
          )}
          {userIsOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#0a0a0a]"></div>
          )}
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg leading-tight font-bold text-gray-900 dark:text-white">{friendName}</h2>
          {friendLastActiveAt && (
            <span className={`text-xs ${userIsOnline ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`}>
              {formatLastActive(friendLastActiveAt)}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
        <button className="hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
        <button className="hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button className="hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
