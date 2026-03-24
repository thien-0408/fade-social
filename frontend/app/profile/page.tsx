"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import FloatingNavbar from "@/components/FloatingNavbar";
import Sidebar from "@/components/Sidebar";
import Post, { PostData } from "@/components/Post";
import Image from "next/image";
import {
  getCurrentUser,
  getPostsByUserId,
  UserData,
  PostData as BackendPost,
} from "../../lib/user";
import { getMyFriends } from "../../lib/friend";
import { isLoggedIn } from "../../lib/auth";
import EditProfileModal from "@/components/EditProfileModal";
import CreateWhisperModal from "@/components/CreateWhisperModal";

export function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
    return url;
  }
  return `/${url}`;
}

/** Map a backend post to the frontend PostData shape */
function mapPost(bp: BackendPost): PostData {
  return {
    id: bp.id,
    author: bp.owner?.fullName || bp.owner?.userName || "Unknown",
    handle: bp.owner?.userName ? `@${bp.owner.userName}` : undefined,
    avatar:
      normalizeImageUrl(bp.owner?.avatarUrl) ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${bp.owner?.userName || "anon"}`,
    content: bp.textContent || "",
    media: bp.mediaUrl || undefined,
    mediaType:
      bp.type === "MEDIA" ? "image" : undefined,
    type: bp.type === "MEDIA" ? "moment" : "thought",
    likes: bp.totalReactions,
    comments: bp.commentCount,
    timestamp: formatTimestamp(bp.createdAt),
    timeLeft: bp.expiresAt ? formatTimeLeft(bp.expiresAt) : undefined,
    ownerId: bp.owner?.id,
  };
}

function formatTimestamp(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatTimeLeft(iso: string): string | undefined {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return undefined;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (hours > 0) return `${String(hours).padStart(2, "0")}h:${String(remainingMins).padStart(2, "0")}m left`;
  return `${mins}m left`;
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Current Thoughts");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isWhisperModalOpen, setIsWhisperModalOpen] = useState(false);

  const [user, setUser] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [friends, setFriends] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    getCurrentUser()
      .then((u) => {
        setUser(u);
        if (u?.profileResponse?.coverImageUrl) {
          setCoverImage(normalizeImageUrl(u.profileResponse.coverImageUrl));
        }
        if (u) {
          return Promise.all([
            getPostsByUserId(u.id),
            getMyFriends()
          ]).then(([backendPosts, friendsList]) => {
            setPosts(backendPosts.map(mapPost));
            setFriends(friendsList);
          });
        }
      })
      .catch(() => {
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const fetchUserData = () => {
    setLoading(true);
    getCurrentUser()
      .then((u) => {
        setUser(u);
        if (u?.profileResponse?.coverImageUrl) {
          setCoverImage(normalizeImageUrl(u.profileResponse.coverImageUrl));
        }
        if (u) {
          return Promise.all([
            getPostsByUserId(u.id),
            getMyFriends()
          ]).then(([backendPosts, friendsList]) => {
            setPosts(backendPosts.map(mapPost));
            setFriends(friendsList);
          });
        }
      })
      .catch(() => {
        router.push("/login");
      })
      .finally(() => setLoading(false));
  };

  /* ── Derived ─────────────────────────────────────────── */
  const profile = user?.profileResponse;
  const displayName = profile?.fullName || user?.userName || "User";
  const bio = profile?.bio || "No bio yet";
  const avatarUrl =
    normalizeImageUrl(profile?.avatarUrl) ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.userName || "anon"}`;
  const defaultCover =
    "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <svg className="w-10 h-10 text-indigo-500 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-[#ededed] transition-colors duration-300">
      <div className="relative z-10 w-full flex justify-between items-start">
        <Sidebar onPostCreated={fetchUserData} />
        
        <div className="flex-1 w-full pb-32">
          {/* Top Search Bar Placeholder */}
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2"></div>
          </div>

          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Cover Image */}
        <div className="relative w-full h-48 md:h-64 rounded-t-3xl overflow-visible bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 mt-4 group">
            <div className="absolute inset-0 rounded-t-3xl overflow-hidden">
                <Image 
                    src={coverImage || defaultCover} 
                    alt="Cover" 
                    fill 
                    className="object-cover opacity-90 dark:opacity-60 transition-transform duration-700 group-hover:scale-105"
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#0a0a0a] dark:via-transparent dark:to-transparent"></div>
            
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
            />
            
            <button 
                onClick={triggerFileInput}
                className="absolute top-4 right-4 bg-black/40 backdrop-blur-md hover:bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border border-white/10 transition group/btn"
            >
                <svg className="w-4 h-4 text-white/70 group-hover/btn:text-white transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                </svg>
                Change Cover
            </button>

            {/* Profile Avatar */}
            <div className="absolute -bottom-12 left-8 md:left-12">
                <div className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-[#0a0a0a] overflow-hidden bg-gray-200 dark:bg-gray-700 relative shadow-xl">
                        <Image 
                            src={avatarUrl} 
                            alt="Profile" 
                            fill
                            className="object-cover" 
                        />
                    </div>
                    <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-white dark:border-[#0a0a0a] rounded-full"></div>
                </div>
            </div>
        </div>

        {/* Profile Details */}
        <div className="mt-14 px-2 md:px-4 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{displayName}</h1>
                    <svg className="w-6 h-6 text-blue-500 fill-current" viewBox="0 0 24 24">
                         <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic mt-1 text-lg">&quot;{bio}&quot;</p>
                <div className="flex items-center gap-6 mt-4 text-sm text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        <span>{posts.length} THOUGHTS</span>
                    </div>
                    <div className="flex items-center gap-2">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        <span>{friends.length} FRIENDS</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>•</span>
                        <span>{posts.reduce((sum, p) => sum + p.likes, 0)} REACTIONS</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-[#1A1D2D] dark:hover:bg-[#25283d] text-gray-900 dark:text-white font-medium rounded-xl border border-gray-200 dark:border-white/5 transition flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    Edit
                </button>
                <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-600/20">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                    Share Profile
                </button>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 mt-10 border-b border-gray-200 dark:border-white/10 pb-4 relative overflow-x-auto whitespace-nowrap custom-scrollbar">
            {["Current Thoughts", "Friends", "Soul Settings"].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                        activeTab === tab ? "text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                    }`}
                >
                    {tab === "Current Thoughts" && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                    {tab === "Friends" && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>}
                    {tab === "Soul Settings" && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>}
                    
                    {tab}
                </button>
            ))}
            
            {/* Active Tab Indicator Bar */}
            <div className="absolute -bottom-px left-0 h-0.5 bg-indigo-600 transition-all duration-300 pointer-events-none" style={{
                 transform: `translateX(${activeTab === "Current Thoughts" ? "0" : activeTab === "Friends" ? "165px" : "260px"})`,
                 width: activeTab === "Current Thoughts" ? "145px" : activeTab === "Friends" ? "80px" : "120px"
             }}></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
            {/* Left Content Column */}
            <div className="flex-1 space-y-6">
                
                {/* Input Box */}
                <div 
                    onClick={() => setIsWhisperModalOpen(true)}
                    className="bg-gray-50 dark:bg-[#11131F] rounded-2xl p-4 border border-gray-200 dark:border-white/5 cursor-text group transition hover:border-indigo-500/30 shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0 relative">
                             <Image 
                                src={avatarUrl} 
                                alt="User" 
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 w-full group-hover:text-gray-600 dark:group-hover:text-gray-300 transition select-none">
                            What will fade away next?
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pl-14 pointer-events-none">
                        <div className="flex items-center gap-3 text-gray-500">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <button className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-lg shadow-indigo-600/30 transition pointer-events-auto hover:bg-indigo-700">
                            Fade It
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {activeTab === "Current Thoughts" && (
                        posts.length > 0 ? (
                          posts.map(post => (
                            <Post key={post.id} post={post} onDelete={(id) => setPosts(posts.filter(p => p.id !== id))} />
                          ))
                        ) : (
                          <div className="text-center py-16 text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                            <p className="text-lg font-medium text-gray-400">No thoughts yet</p>
                            <p className="text-sm mt-1">Your first whisper awaits…</p>
                          </div>
                        )
                    )}

                    {activeTab === "Friends" && (
                        friends.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {friends.map(friend => (
                                    <div key={friend.id} className="bg-gray-50 dark:bg-[#11131F] rounded-2xl p-4 border border-gray-200 dark:border-white/5 flex items-center gap-4 hover:border-gray-300 dark:hover:border-white/10 transition cursor-pointer" onClick={() => router.push(`/profile/${friend.id}`)}>
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                                            <Image 
                                                src={normalizeImageUrl(friend.profileResponse?.avatarUrl) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.userName}`}
                                                alt={friend.userName}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-gray-900 dark:text-white font-medium">{friend.profileResponse?.fullName || friend.userName}</h4>
                                            <p className="text-gray-500 text-sm">@{friend.userName}</p>
                                        </div>
                                        <button className="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-white/5 dark:hover:bg-white/10 rounded-full text-gray-900 dark:text-white transition">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                <p className="text-lg font-medium text-gray-400">No friends yet</p>
                                <p className="text-sm mt-1">Start connecting with other minds.</p>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-80 space-y-6">

                {/* Profile Info Card */}
                <div className="bg-gray-50 dark:bg-[#11131F] rounded-2xl p-5 border border-gray-200 dark:border-white/5">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">About</h3>
                    <div className="space-y-3 text-sm">
                        {profile?.phoneNumber && (
                          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            <span>{profile.phoneNumber}</span>
                          </div>
                        )}
                        {user?.email && (
                          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            <span>{user.email}</span>
                          </div>
                        )}
                        {profile?.dateOfBirth && (
                          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <span>{profile.dateOfBirth}</span>
                          </div>
                        )}
                        {profile?.gender && (
                          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            <span>{profile.gender.charAt(0) + profile.gender.slice(1).toLowerCase()}</span>
                          </div>
                        )}
                    </div>
                </div>

                {/* Footer Links */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-gray-600 px-2">
                    <a href="#" className="hover:text-gray-400">About Fade</a>
                    <a href="#" className="hover:text-gray-400">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-400">Terms of Service</a>
                    <span>© 2026 Fade Inc.</span>
                </div>

            </div>
        </div>

          </div>
        </div>
      </div>
      
      <div className="md:hidden">
        <FloatingNavbar />
      </div>
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        currentProfile={profile || null}
        onSuccess={fetchUserData}
      />
      <CreateWhisperModal 
        isOpen={isWhisperModalOpen} 
        onClose={() => setIsWhisperModalOpen(false)} 
        user={user} 
        onSuccess={fetchUserData} 
      />
    </div>
  );
}
