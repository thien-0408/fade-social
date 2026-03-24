"use client";

import Image from "next/image";

interface FriendRequestCardProps {
  name: string;
  message: string;
  avatarUrl?: string;
  imageUrl: string;
  onAccept?: () => void;
  onDrift?: () => void;
}

export default function FriendRequestCard({
  name,
  message,
  imageUrl,
  onAccept,
  onDrift,
}: FriendRequestCardProps) {
  return (
    <div className="bg-[#1A1A2E]/80 backdrop-blur-sm rounded-2xl p-5 border border-white/5 flex items-start gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-pink-400 text-lg">💜</span>
          <h3 className="font-semibold text-white text-base">
            New Soul Connection
          </h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">{name} wants to resonate with your vibe.</p>
        <div className="flex items-center gap-3">
          <button
            onClick={onAccept}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-full transition-all duration-200 shadow-lg shadow-indigo-500/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Accept
          </button>
          <button
            onClick={onDrift}
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-200 text-sm font-medium px-4 py-2 rounded-full border border-white/10 hover:border-white/20 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Drift Away
          </button>
        </div>
      </div>

      {/* Gradient image thumbnail */}
      <div className="w-[140px] h-[120px] rounded-xl overflow-hidden flex-shrink-0">
        <Image
          src={imageUrl}
          alt={`${name}'s vibe`}
          width={140}
          height={120}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
