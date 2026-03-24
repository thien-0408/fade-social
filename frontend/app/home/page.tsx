"use client";

import FloatingNavbar from "../../components/FloatingNavbar";
import Post, { PostData } from "../../components/Post";
import Sidebar from "../../components/Sidebar";
import CreateWhisperModal from "../../components/CreateWhisperModal";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  UserData,
  PostData as BackendPost,
  searchUsers,
  getOnlineUsers,
} from "../../lib/user";
import { isLoggedIn } from "../../lib/auth";
import { getFeedPosts, createPost } from "../../lib/post";
import { isOnline } from "../../lib/dateUtils";

/**
 * Ensure image URLs from the backend are valid for next/image.
 * Relative paths like "uploads/..." get a leading "/".
 */
export function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
    return url;
  }
  return `/${url}`;
}

function getMediaType(url: string | undefined | null): "image" | "video" | "audio" | undefined {
  if (!url) return undefined;
  const lower = url.toLowerCase();
  if (lower.match(/\.(mp4|webm|ogg)$/)) return "video";
  if (lower.match(/\.(mp3|wav|m4a)$/)) return "audio";
  return "image"; // fallback
}

function mapPost(bp: BackendPost): PostData {
  const isMedia = bp.type === "MEDIA";
  return {
    id: bp.id,
    author: bp.owner?.fullName || bp.owner?.userName || "Unknown",
    handle: bp.owner?.userName ? `@${bp.owner.userName}` : undefined,
    avatar:
      normalizeImageUrl(bp.owner?.avatarUrl) ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${bp.owner?.userName || "anon"}`,
    content: bp.textContent || "",
    media: bp.mediaUrl ? (normalizeImageUrl(bp.mediaUrl) || undefined) : undefined,
    mediaType: isMedia ? getMediaType(bp.mediaUrl) : undefined,
    type: isMedia ? "moment" : "thought",
    likes: bp.totalReactions,
    comments: bp.commentCount,
    timestamp: formatTimestamp(bp.createdAt),
    timeLeft: bp.expiresAt ? formatTimeLeft(bp.expiresAt) : undefined,
    isNew: isRecent(bp.createdAt),
    loveCount: bp.loveCount || 0,
    totalReactions: bp.totalReactions || 0,
    commentCount: bp.commentCount || 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentReaction: bp.currentReaction as any,
    ttlMinutes: 0,
    ownerId: bp.owner?.id,
    owner: bp.owner,
    textContent: bp.textContent,
    mediaUrl: bp.mediaUrl,
    createdAt: bp.createdAt,
    expiresAt: bp.expiresAt,
  } as unknown as PostData;
}

function formatTimestamp(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "JUST NOW";
  if (mins < 60) return `${mins}M AGO`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} HOURS AGO`;
  const days = Math.floor(hours / 24);
  return `${days}D AGO`;
}

function formatTimeLeft(iso: string): string | undefined {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return undefined;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (hours > 0) return `${String(hours).padStart(2, "0")}H ${String(remainingMins).padStart(2, "0")}M REMAINING`;
  return `${mins}M REMAINING`;
}

function isRecent(iso: string): boolean {
  return Date.now() - new Date(iso).getTime() < 300000; // 5 minutes
}



export default function NewfeedPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showWhisperModal, setShowWhisperModal] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserData[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [onlineUsers, setOnlineUsers] = useState<UserData[]>([]);

  const [inlineContent, setInlineContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);



  const handleInlineSubmit = async () => {
    if (!inlineContent.trim()) return;
    setIsSubmitting(true);
    try {
      await createPost("THOUGHT", inlineContent.trim(), null, 12 * 60);
      setInlineContent("");
      setIsExpanded(false);
      refreshPosts();
    } catch (e) {
      console.error(e);
      alert("Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      setIsSearching(true);
      searchUsers(searchQuery)
        .then(setSearchResults)
        .finally(() => setIsSearching(false));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const refreshPosts = () => {
    getFeedPosts(1, 50).then((pageRes) => {
      setPosts(pageRes.data.map(mapPost));
    });
  };

  useEffect(() => {
    getOnlineUsers().then(users => {
        setOnlineUsers(users);
    }).catch(console.error);
  }, []);

  /* ── Auth redirect ──────────────────────────────────── */
  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    getCurrentUser()
      .then((u) => {
        setUser(u);
        return getFeedPosts(1, 50).then((pageRes) => {
          setPosts(pageRes.data.map(mapPost));
        });
      })
      .catch(() => {
        /* token likely expired */
        router.push("/login");
      })
      .finally(() => setLoadingUser(false));
  }, [router]);

  /* ── Theme ──────────────────────────────────────────── */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(systemTheme);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ── Derived data ───────────────────────────────────── */
  const profile = user?.profileResponse;
  const avatarUrl =
    normalizeImageUrl(profile?.avatarUrl) ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.userName || "anon"}`;

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F1A]">
        <div className="flex flex-col items-center gap-4">
          <svg className="w-10 h-10 text-indigo-500 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-400 text-sm">Loading your feed…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0c1014] text-gray-900 dark:text-gray-100 relative selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-white transition-colors duration-300">


      <div className="relative z-10 w-full flex justify-between items-start">
        
        {/* Left Sidebar */}
        <Sidebar onPostCreated={refreshPosts} />

        <div className="flex-1 max-w-[630px] w-full mx-auto md:mx-10 pb-20 pt-8">
        
        {/* Navbar */}
        <div className="flex items-center justify-center mb-8 sticky top-0 z-50 bg-transparent dark:bg-[#0c1014]/80 backdrop-blur-md py-4 transition-colors duration-300">
             {/* Search Bar */}
             <div className="relative">
                 <div className="hidden md:flex items-center gap-4 bg-gray-100 dark:bg-[#1A1A27] px-4 py-2 rounded-full border border-gray-200 dark:border-white/5 w-96 transition-colors duration-300">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search users..." 
                        className="bg-transparent border-none outline-none text-sm w-full text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
                    />
                 </div>
                 {searchQuery.trim() && (
                    <div className="absolute top-12 left-0 w-full bg-white dark:bg-[#1A1A27] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-50">
                        {isSearching ? (
                            <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
                        ) : searchResults.length > 0 ? (
                            <div className="max-h-64 overflow-y-auto">
                                {searchResults.map(u => (
                                    <button 
                                      key={u.id}
                                      onClick={() => router.push(`/profile/${u.id}`)}
                                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition text-left"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
                                            <Image src={normalizeImageUrl(u.profileResponse?.avatarUrl) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.userName}`} alt="Avatar" width={32} height={32} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{u.profileResponse?.fullName || u.userName}</div>
                                            <div className="text-xs text-gray-500">@{u.userName}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-sm text-gray-500">No users found</div>
                        )}
                    </div>
                 )}
             </div>


        </div>

        <div className="max-w-2xl mx-auto space-y-8 pb-20">
            
            {/* Horizontal Vanishing Soon Carousel */}
            {posts.filter(p => p.timeLeft).length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <span className="text-red-500 animate-pulse"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/></svg></span>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 tracking-wider">VANISHING SOON</h3>
                    </div>
                    
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {posts.filter(p => p.timeLeft).slice(0, 10).map(p => (
                            <motion.div 
                                whileHover={{ scale: 1.02, y: -4 }}
                                key={`vanishing-${p.id}`}
                                className="snap-start shrink-0 w-64 bg-white/60 dark:bg-[#181825]/60 backdrop-blur-xl rounded-3xl p-5 border border-red-500/20 shadow-lg cursor-pointer flex flex-col justify-between min-h-[140px]"
                            >
                                <div className="flex items-center justify-between text-xs mb-3">
                                    <span className="text-gray-500 dark:text-gray-400 font-medium truncate pr-2" title={p.handle}>{p.handle}</span>
                                    <span className="text-red-500 font-bold bg-red-500/10 px-2 py-1 rounded-md text-[10px] whitespace-nowrap">{p.timeLeft}</span>
                                </div>
                                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 leading-snug line-clamp-3">
                                    {p.content}
                                </h4>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Inline Expandable Input Area */}
            <motion.div 
                layout
                className="bg-white/80 dark:bg-[#181825]/80 backdrop-blur-xl rounded-3xl p-5 border border-indigo-100 dark:border-indigo-500/10 shadow-xl shadow-indigo-500/5 overflow-hidden"
            >
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-indigo-100 dark:border-indigo-500/20 group-hover:border-indigo-300 transition-colors">
                        <Image src={avatarUrl} alt="Profile" width={48} height={48} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                         <textarea 
                            value={inlineContent}
                            onChange={(e) => setInlineContent(e.target.value)}
                            onFocus={() => setIsExpanded(true)}
                            placeholder="What's on your mind before it's gone?" 
                            className="w-full bg-transparent text-lg text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none pt-2.5 resize-none transition-all duration-300"
                            rows={isExpanded ? 3 : 1}
                         />
                    </div>
                </div>
                
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-white/5"
                        >
                            <div className="flex items-center gap-1 sm:gap-2 text-gray-400">
                                 <button onClick={() => setShowWhisperModal(true)} title="Advanced Media" className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full hover:text-indigo-500 transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></button>
                                 <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full hover:text-indigo-500 transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => {
                                        setIsExpanded(false);
                                        setInlineContent("");
                                    }} 
                                    className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleInlineSubmit}
                                    disabled={!inlineContent.trim() || isSubmitting}
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:shadow-none"
                                >
                                    {isSubmitting ? "Whispering..." : "Whisper"}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Feed Header */}
            <div className="flex items-center justify-between pt-6 pb-2">
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">The Feed</h3>
                 <button className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-[#1A1A27] px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-white/5 transition">
                     Newest First
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                 </button>
            </div>

            {/* Posts */}
            <motion.div layout className="space-y-6">
                <AnimatePresence mode="popLayout">
                {posts.length > 0 ? (
                  posts.map((post, idx) => (
                    <motion.div
                        layout
                        key={`post-${post.id}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.4, delay: idx < 5 ? idx * 0.1 : 0 }}
                    >
                        <Post post={post} onDelete={(id) => setPosts(posts.filter(p => p.id !== id))} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 text-gray-500 bg-white/30 dark:bg-[#181825]/30 rounded-3xl border border-dashed border-gray-200 dark:border-white/10"
                  >
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                    <p className="text-xl font-medium text-gray-600 dark:text-gray-400">No whispers yet</p>
                    <p className="text-sm mt-2">Share your first thought before it fades away.</p>
                  </motion.div>
                )}
                </AnimatePresence>
            </motion.div>

        </div>
        </div>

        {/* Right Sidebar - Online Users */}
        <div className="hidden lg:block w-[320px] shrink-0 sticky top-0 h-screen py-8 pr-8 pl-6">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-6">ONLINE USERS</h3>
            
            <div className="space-y-4">
                {onlineUsers.length > 0 ? (
                  onlineUsers.map((u, i) => {
                    const avatar = normalizeImageUrl(u.profileResponse?.avatarUrl) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.userName}`;
                    const customUser = u as UserData & { lastActiveAt?: string };
                    const isUserOnline = customUser.lastActiveAt ? isOnline(customUser.lastActiveAt) : true;
                    return (
                        <div key={u.id || i} onClick={() => router.push(`/profile/${u.id}`)} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="relative shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                                         <Image src={avatar} alt="Online user" width={40} height={40} className="w-full h-full object-cover" />
                                    </div>
                                    {isUserOnline && (
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#0c1014] rounded-full"></div>
                                    )}
                                </div>
                                <div className="truncate">
                                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-500 transition truncate max-w-[150px]">{u.profileResponse?.fullName || u.userName}</div>
                                    <div className="text-xs text-gray-500">{isUserOnline ? 'Active now' : 'Offline'}</div>
                                </div>
                            </div>
                        </div>
                    );
                  })
                ) : (
                    <div className="text-xs text-gray-500">No users found</div>
                )}
            </div>

            <div className="mt-8 text-xs text-gray-400 space-y-2">
                <div className="flex gap-3">
                    <a href="#" className="hover:underline">About</a>
                    <a href="#" className="hover:underline">Help</a>
                    <a href="#" className="hover:underline">Privacy</a>
                </div>
                <div className="flex gap-3">
                    <a href="#" className="hover:underline">Terms</a>
                    <a href="#" className="hover:underline">Locations</a>
                </div>
                <div className="pt-2 text-gray-500">
                    © 2024 FADE FROM NOTHING
                </div>
            </div>
        </div>

      </div>

      <div className="md:hidden">
        <FloatingNavbar />
      </div>
      <CreateWhisperModal isOpen={showWhisperModal} onClose={() => setShowWhisperModal(false)} onSuccess={refreshPosts} user={user} />
    </div>
  );
}
