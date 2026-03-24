"use client";

import Image from "next/image";

interface SuggestedConnectionItemProps {
  name: string;
  reason: string;
  avatarUrl: string;
  onConnect?: () => void;
}

export default function SuggestedConnectionItem({
  name,
  reason,
  avatarUrl,
  onConnect,
}: SuggestedConnectionItemProps) {
  return (
    <div className="flex items-center gap-3 py-2 group">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
        <Image
          src={avatarUrl}
          alt={name}
          width={40}
          height={40}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{name}</p>
        <p className="text-xs text-gray-500 truncate">{reason}</p>
      </div>

      {/* Connect button */}
      <button
        onClick={onConnect}
        className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-all duration-200 flex-shrink-0 shadow-lg shadow-indigo-500/20"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
