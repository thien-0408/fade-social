"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { updateProfile, Gender, ProfileResponse } from "@/lib/profile";
import { ApiRequestError } from "@/lib/api";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: ProfileResponse | null;
  onSuccess: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentProfile,
  onSuccess,
}: EditProfileModalProps) {
  /* ── Form State ──────────────────────────────────────── */
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState<Gender>("MALE");
  const [dateOfBirth, setDateOfBirth] = useState("");
  
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  /* ── UI State ────────────────────────────────────────── */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Refs ────────────────────────────────────────────── */
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && currentProfile) {
      setFullName(currentProfile.fullName || "");
      setBio(currentProfile.bio || "");
      setPhoneNumber(currentProfile.phoneNumber || "");
      setGender(currentProfile.gender || "MALE");
      setDateOfBirth(currentProfile.dateOfBirth || "");
      
      // Preserve existing images as previews
      setAvatarPreview(currentProfile.avatarUrl || null);
      setCoverPreview(currentProfile.coverImageUrl || null);
      
      setAvatar(null);
      setCoverImage(null);
      setError(null);
    }
  }, [isOpen, currentProfile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatar(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setCoverImage(file);
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await updateProfile({
        bio,
        fullName,
        phoneNumber,
        gender,
        dateOfBirth,
        avatar,
        coverImage,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
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
      <div className="absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-md animate-fadeIn transition-colors duration-300" />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#13141f] rounded-2xl border border-gray-200 dark:border-white/5 shadow-2xl shadow-indigo-900/10 animate-slideUp custom-scrollbar transition-colors duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#13141f]/90 backdrop-blur-sm border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-6 py-4 transition-colors duration-300">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
            {/* Visual Header (Cover + Avatar) - Centered visually */}
            <div className="w-full relative h-48 sm:h-56 rounded-xl overflow-visible bg-gray-100 dark:bg-[#1a1c29] border border-gray-200 dark:border-white/5 mb-16 transition-colors duration-300">
              {/* Cover Image Upload */}
              <div 
                onClick={() => coverInputRef.current?.click()}
                className="absolute inset-0 rounded-xl overflow-hidden cursor-pointer group"
              >
                {coverPreview ? (
                  <Image src={coverPreview} alt="Cover" fill className="object-cover opacity-90 dark:opacity-70 group-hover:opacity-70 dark:group-hover:opacity-50 transition-opacity" unoptimized={coverPreview.startsWith("blob:")} />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 transition-colors duration-300" />
                )}
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 dark:bg-black/40">
                  <div className="bg-white/90 text-gray-900 dark:bg-black/60 dark:text-white backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 border border-gray-200 dark:border-white/10 text-sm shadow-sm transition-colors duration-300">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Change Cover
                  </div>
                </div>
                <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
              </div>

              {/* Avatar Upload */}
              <div 
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-[#13141f] bg-gray-100 dark:bg-[#1a1c29] overflow-hidden cursor-pointer group z-10 transition-colors duration-300 shadow-sm"
              >
                {avatarPreview ? (
                  <Image src={avatarPreview.startsWith("/") || avatarPreview.startsWith("http") || avatarPreview.startsWith("blob:") ? avatarPreview : `/${avatarPreview}`} alt="Avatar" fill className="object-cover group-hover:opacity-80 dark:group-hover:opacity-60 transition-opacity" unoptimized={avatarPreview.startsWith("blob:")} />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-500 transition-colors duration-300">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 dark:bg-black/40">
                  <svg className="w-8 h-8 text-white dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
            </div>

            {/* Input Fields */}
            <div className="w-full space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors duration-300">Display Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-gray-50 dark:bg-[#1a1c29] border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white px-4 py-3 rounded-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  placeholder="How should people call you?"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors duration-300">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-gray-50 dark:bg-[#1a1c29] border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white px-4 py-3 rounded-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none"
                  placeholder="Tell your story..."
                />
              </div>

              {/* Grid: Phone & Date of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors duration-300">Phone</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#1a1c29] border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white px-4 py-3 rounded-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors duration-300">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    className="w-full bg-gray-50 dark:bg-[#1a1c29] border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white px-4 py-3 rounded-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all dark:[color-scheme:dark] [color-scheme:light]"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors duration-300">Gender</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["MALE", "FEMALE", "OTHER"] as Gender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        gender === g
                          ? "bg-indigo-50 dark:bg-indigo-600/20 border-indigo-200 dark:border-indigo-500/50 text-indigo-600 dark:text-indigo-300 shadow-sm dark:shadow-none"
                          : "bg-gray-50 dark:bg-[#1a1c29] border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/10 hover:text-gray-900 dark:hover:text-gray-300"
                      }`}
                    >
                      {g.charAt(0) + g.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-full pt-4 border-t border-gray-200 dark:border-white/5 mt-4 transition-colors duration-300">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

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
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(0,0,0,0.1); 
          border-radius: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
          background: rgba(0,0,0,0.2); 
        }
        @media (prefers-color-scheme: dark) {
          .custom-scrollbar::-webkit-scrollbar-thumb { 
            background: rgba(255,255,255,0.1); 
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
            background: rgba(255,255,255,0.2); 
          }
        }
      `}</style>
    </div>
  );
}
