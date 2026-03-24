"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { createPost } from "@/lib/post";
import { UserData } from "@/lib/user";

interface CreateWhisperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  user?: UserData | null;
}

const MOODS = [
  "Feeling Melancholic",
  "Feeling Dreamy",
  "Feeling Nostalgic",
  "Feeling Euphoric",
  "Feeling Lost",
  "Feeling Alive",
];

export default function CreateWhisperModal({
  isOpen,
  onClose,
  onSuccess,
  user,
}: CreateWhisperModalProps) {
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(
    "Feeling Melancholic"
  );
  const [ttl, setTtl] = useState(12); // hours
  const [mediaFiles, setMediaFiles] = useState<
    { url: string; type: "image" | "video"; name: string }[]
  >([]);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [visibility, setVisibility] = useState<"public" | "friends">("public");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file);
        const isVideo = file.type.startsWith("video/");
        setMediaFiles((prev) => [
          ...prev,
          { url, type: isVideo ? "video" : "image", name: file.name },
        ]);
      });

      // Reset input so same file can be selected again
      e.target.value = "";
    },
    []
  );

  const removeMedia = useCallback((index: number) => {
    setMediaFiles((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!content.trim() && mediaFiles.length === 0) return;
      setLoading(true);
      
      const file = mediaFiles.length > 0 ? await fetch(mediaFiles[0].url).then(r => r.blob()).then(blob => new File([blob], mediaFiles[0].name, { type: mediaFiles[0].type === "video" ? "video/mp4" : "image/jpeg" })) : null;
      const type = file ? "MEDIA" : "THOUGHT";
      
      await createPost(
        type,
        content.trim(),
        file,
        ttl * 60 // convert hours to minutes
      );
      
      // Reset state
      setContent("");
      setMediaFiles([]);
      setSelectedMood("Feeling Melancholic");
      setTtl(12);
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to create post", error);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-0"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-fadeIn transition-colors duration-300" />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-auto bg-white dark:bg-[#1A1A2E] rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl dark:shadow-purple-900/30 animate-slideUp transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <div /> {/* spacer */}
          <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">Create Whisper</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-white/5 transition-colors duration-300" />

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* User row */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-white/10 shrink-0 bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
              <Image
                src={user?.profileResponse?.avatarUrl ? (user.profileResponse.avatarUrl.startsWith("/") || user.profileResponse.avatarUrl.startsWith("http") ? user.profileResponse.avatarUrl : `/${user.profileResponse.avatarUrl}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.userName || "anon"}`}
                alt={user?.profileResponse?.fullName || user?.userName || "User"}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-white text-sm transition-colors duration-300">
                  {user?.profileResponse?.fullName || user?.userName || "You"}
                </span>
                <button
                  onClick={() =>
                    setVisibility((v) =>
                      v === "public" ? "friends" : "public"
                    )
                  }
                  className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/20 transition"
                >
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {visibility === "public" ? (
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    ) : (
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                    )}
                  </svg>
                  {visibility === "public" ? "Public" : "Friends"}
                </button>
              </div>
            </div>
          </div>

          {/* Text input */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's weighing on your soul?"
            className="w-full bg-transparent text-gray-900 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none resize-none text-base leading-relaxed min-h-[100px] transition-colors duration-300"
            rows={4}
          />

          {/* Media previews */}
          {mediaFiles.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {mediaFiles.map((file, index) => (
                <div key={index} className="relative group">
                  {file.type === "image" ? (
                    <Image
                      src={file.url}
                      alt={file.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-xl border border-gray-200 dark:border-white/10"
                    />
                  ) : (
                     <video
                      src={file.url}
                      className="w-20 h-20 object-cover rounded-xl border border-gray-200 dark:border-white/10"
                    />
                  )}
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  {file.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white/80"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Mood tag */}
          <div className="relative">
            {selectedMood ? (
              <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-sm px-3 py-1.5 rounded-full transition-colors duration-300">
                <span>🌧</span>
                <span>{selectedMood}</span>
                <button
                  onClick={() => setSelectedMood(null)}
                  className="text-indigo-400 hover:text-indigo-700 dark:hover:text-white transition"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowMoodPicker(!showMoodPicker)}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
              >
                + Add a mood
              </button>
            )}

            {/* Mood picker dropdown */}
            {showMoodPicker && !selectedMood && (
              <div className="absolute top-full mt-2 left-0 bg-white dark:bg-[#252540] border border-gray-200 dark:border-white/10 rounded-xl p-2 shadow-xl z-10 min-w-[180px] transition-colors duration-300">
                {MOODS.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => {
                      setSelectedMood(mood);
                      setShowMoodPicker(false);
                    }}
                    className="w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 px-3 py-2 rounded-lg transition"
                  >
                    🌧 {mood}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Attachment bar */}
          <div className="flex items-center justify-between bg-gray-50 dark:bg-[#252540]/60 rounded-xl px-4 py-3 border border-gray-200 dark:border-white/5 transition-colors duration-300">
            <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              Add to your whisper
            </span>
            <div className="flex items-center gap-3">
              {/* Photo/Video */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                title="Photo / Video"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>

              {/* Tag people */}
              <button
                className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                title="Tag people"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </button>

              {/* Emoji */}
              <button
                onClick={() => setShowMoodPicker(!showMoodPicker)}
                className="text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                title="Feeling / Mood"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              {/* Location */}
              <button
                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                title="Location"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>

              {/* GIF */}
              <button
                className="text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
                title="GIF"
              >
                <span className="text-xs font-bold border border-gray-400 rounded px-1 py-0.5 hover:border-purple-500 dark:hover:border-purple-400">
                  GIF
                </span>
              </button>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Time-to-Live slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Time-to-Live
                </span>
              </div>
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 transition-colors duration-300">
                {ttl} Hours
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={24}
              value={ttl}
              onChange={(e) => setTtl(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-purple-500 custom-range"
              style={{
                background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${
                  ((ttl - 1) / 23) * 100
                }%, var(--track-color, #E5E7EB) ${((ttl - 1) / 23) * 100}%, var(--track-color, #E5E7EB) 100%)`,
              }}
            />
            <div className="flex justify-between mt-1.5">
              <span className="text-[11px] text-gray-400 dark:text-gray-500">1h</span>
              <span className="text-[11px] text-gray-400 dark:text-gray-500">24h</span>
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={(!content.trim() && mediaFiles.length === 0) || loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 dark:hover:from-purple-500 dark:hover:to-purple-400 transition-all duration-200 shadow-lg shadow-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? "Releasing..." : "Release to the Void"}
          </button>
        </div>
      </div>

      {/* CSS for custom animations and range thumb */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        
        .custom-range {
          --track-color: #E5E7EB;
        }
        @media (prefers-color-scheme: dark) {
          .custom-range {
            --track-color: #2A2A3E;
          }
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 0 8px rgba(168, 85, 247, 0.5);
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 0 8px rgba(168, 85, 247, 0.5);
        }
        @media (prefers-color-scheme: dark) {
          input[type="range"]::-webkit-slider-thumb {
            border: 3px solid #1a1a2e;
          }
          input[type="range"]::-moz-range-thumb {
            border: 3px solid #1a1a2e;
          }
        }
      `}</style>
    </div>
  );
}
