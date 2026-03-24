"use client";

interface ExpiringItemCardProps {
  timeLeft: string;
  title: string;
  subtitle?: string;
  urgency?: "high" | "medium";
  hearts?: number;
  views?: number;
}

export default function ExpiringItemCard({
  timeLeft,
  title,
  subtitle,
  urgency = "medium",
  hearts,
  views,
}: ExpiringItemCardProps) {
  const isHigh = urgency === "high";

  return (
    <div
      className={`rounded-xl p-4 border transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
        isHigh
          ? "bg-gradient-to-br from-red-900/40 to-orange-900/20 border-red-500/20"
          : "bg-gradient-to-br from-amber-900/30 to-yellow-900/15 border-amber-500/15"
      }`}
    >
      {/* Time badge + menu */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isHigh ? "bg-red-500 animate-pulse" : "bg-amber-500"
            }`}
          />
          <span
            className={`text-xs font-semibold ${
              isHigh ? "text-red-400" : "text-amber-400"
            }`}
          >
            {timeLeft}
          </span>
        </div>
        <button className="text-gray-500 hover:text-gray-300 transition">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <h4 className="text-sm font-semibold text-white leading-snug mb-1">
        {title}
      </h4>
      {subtitle && (
        <p className="text-xs text-gray-400">{subtitle}</p>
      )}

      {/* Stats */}
      {(hearts !== undefined || views !== undefined) && (
        <div className="flex items-center gap-3 mt-2">
          {hearts !== undefined && (
            <span className="flex items-center gap-1 text-xs text-pink-400">
              ❤️ {hearts}
            </span>
          )}
          {views !== undefined && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              👁 {views}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
