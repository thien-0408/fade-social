"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import FloatingNavbar from "@/components/FloatingNavbar";
import Sidebar from "@/components/Sidebar";
import Post, { PostData } from "@/components/Post";
import Image from "next/image";
import {
  getUserById,
  getPostsByUserId,
  UserData,
  PostData as BackendPost,
} from "../../../lib/user";
import { 
  getUserFriends, 
  getFriendshipStatus, 
  sendFriendRequest, 
  unfriend 
} from "../../../lib/friend";
import { isLoggedIn } from "../../../lib/auth";

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
    mediaType: bp.type === "MEDIA" ? "image" : undefined,
    type: bp.type === "MEDIA" ? "moment" : "thought",
    likes: bp.totalReactions,
    comments: bp.commentCount,
    timestamp: formatTimestamp(bp.createdAt),
    timeLeft: bp.expiresAt ? formatTimeLeft(bp.expiresAt) : undefined,
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

export default function DynamicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const targetId = params.id as string;
  
  const [activeTab, setActiveTab] = useState("Current Thoughts");
  const [user, setUser] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [friends, setFriends] = useState<UserData[]>([]);
  const [friendStatus, setFriendStatus] = useState<string>("NONE");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

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

    if (targetId) {
      Promise.all([
        getUserById(targetId),
        getPostsByUserId(targetId),
        getUserFriends(targetId),
        getFriendshipStatus(targetId)
      ])
        .then(([u, backendPosts, friendsList, status]) => {
          if (status === "SELF") {
             router.replace("/profile");
             return;
          }
          setUser(u);
          setPosts(backendPosts.map(mapPost));
          setFriends(friendsList);
          setFriendStatus(status);
        })
        .catch(() => {
          // Could be 404 or unauthorized
          // Could redirect to a generic 404 page, but for now just go home
          router.push("/home");
        })
        .finally(() => setLoading(false));
    }
  }, [router, targetId]);

  const handleFriendAction = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      if (friendStatus === "NONE" || friendStatus === "PENDING_RECEIVED") {
         // If none, send request. If pending received, accepting it here is possible but for simplicity let's stick to send.
         // Actually, if PENDING_RECEIVED they shouldn't just "add friend", they should "Accept" but sendFriendRequest will throw FRIENDSHIP_EXISTED.
         // Let's assume the button handles just SEND for now, or ACCEPT if we wired it. 
         // But sendFriendRequest covers sending.
         await sendFriendRequest(targetId);
         setFriendStatus("PENDING_SENT");
      } else if (friendStatus === "FRIENDS" || friendStatus === "PENDING_SENT") {
         await unfriend(targetId);
         setFriendStatus("NONE");
      }
    } catch(e) {
      console.error(e);
      alert("Action failed.");
    } finally {
      setActionLoading(false);
    }
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
  const coverImage = normalizeImageUrl(profile?.coverImageUrl) || defaultCover;

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

  const renderFriendButton = () => {
    if (friendStatus === "NONE") {
       return (
         <button onClick={handleFriendAction} disabled={actionLoading} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-600/20">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
             Add Friend
         </button>
       );
    } else if (friendStatus === "PENDING_SENT") {
       return (
         <button onClick={handleFriendAction} disabled={actionLoading} className="px-6 py-2 bg-gray-600 hover:bg-red-600/80 disabled:opacity-50 text-white font-medium rounded-xl transition flex items-center gap-2 group">
             <span className="group-hover:hidden flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Pending</span>
             <span className="hidden group-hover:flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> Cancel Request</span>
         </button>
       );
    } else if (friendStatus === "PENDING_RECEIVED") {
       return (
         <button disabled className="px-6 py-2 bg-blue-600/50 text-white font-medium rounded-xl transition flex items-center gap-2 cursor-not-allowed">
             Review Request in Settings
         </button>
       );
    } else if (friendStatus === "FRIENDS") {
       return (
         <button onClick={handleFriendAction} disabled={actionLoading} className="px-6 py-2 bg-gray-100 hover:bg-red-500 hover:text-white dark:bg-[#1A1D2D] dark:hover:bg-red-600/80 disabled:opacity-50 text-gray-900 dark:text-white font-medium rounded-xl border border-gray-200 dark:border-white/5 transition flex items-center gap-2 group">
             <span className="group-hover:hidden flex items-center gap-2"><svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Friends</span>
             <span className="hidden group-hover:flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"></path></svg> Unfriend</span>
         </button>
       );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-[#ededed] transition-colors duration-300">
      <div className="relative z-10 w-full flex justify-between items-start">
        <Sidebar />
        
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
                    src={coverImage} 
                    alt="Cover" 
                    fill 
                    className="object-cover opacity-90 dark:opacity-60 transition-transform duration-700 group-hover:scale-105"
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#0a0a0a] dark:via-transparent dark:to-transparent"></div>
            
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
                {renderFriendButton()}
            </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 mt-10 border-b border-gray-200 dark:border-white/10 pb-4 relative overflow-x-auto whitespace-nowrap custom-scrollbar">
            {["Current Thoughts", "Friends"].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                        activeTab === tab ? "text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                    }`}
                >
                    {tab === "Current Thoughts" && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                    {tab === "Friends" && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>}
                    
                    {tab}
                </button>
            ))}
            
            {/* Active Tab Indicator Bar */}
            <div className="absolute -bottom-px left-0 h-0.5 bg-indigo-600 transition-all duration-300 pointer-events-none" style={{
                 transform: `translateX(${activeTab === "Current Thoughts" ? "0" : "165px"})`,
                 width: activeTab === "Current Thoughts" ? "145px" : "80px"
             }}></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
            {/* Left Content Column */}
            <div className="flex-1 space-y-6">
                
                {/* Tab Content */}
                <div className="space-y-6">
                    {activeTab === "Current Thoughts" && (
                        posts.length > 0 ? (
                          posts.map(post => (
                            <Post key={post.id} post={post} />
                          ))
                        ) : (
                          <div className="text-center py-16 text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                            <p className="text-lg font-medium text-gray-400">No thoughts yet</p>
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
    </div>
  );
}
