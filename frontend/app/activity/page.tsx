"use client";

import FloatingNavbar from "@/components/FloatingNavbar";
import Sidebar from "@/components/Sidebar";
import NotificationItem from "@/components/activity/NotificationItem";
import FriendRequestCard from "@/components/activity/FriendRequestCard";
import ExpiringItemCard from "@/components/activity/ExpiringItemCard";
import SuggestedConnectionItem from "@/components/activity/SuggestedConnectionItem";
import Image from "next/image";
import { useState, useEffect } from "react";
import { fetchNotifications, markNotificationAsRead } from "@/lib/notification";
import { acceptFriendRequest, declineFriendRequest } from "@/lib/friend";
import { useNotifications } from "@/contexts/NotificationContext";

// ─── Demo data ───────────────────────────────────────────────

const EXPIRING_ITEMS = [
  {
    id: 1,
    timeLeft: "15m left",
    title: "Friend Request from VoidWalker",
    subtitle: "Unanswered requests fade in 24h.",
    urgency: "high" as const,
  },
  {
    id: 2,
    timeLeft: "1h left",
    title: 'Your echo "Lost in translation"',
    urgency: "medium" as const,
    hearts: 12,
    views: 145,
  },
];

const SUGGESTED_CONNECTIONS = [
  {
    id: 1,
    name: "EchoSeeker_99",
    reason: "Similar vibe",
    avatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "NeonDust",
    reason: "From your last echo",
    avatarUrl:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop",
  },
];

// ─── Page ────────────────────────────────────────────────────

export default function ActivityPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const { notifications, setNotifications, markAsRead } = useNotifications();
  const [loading, setLoading] = useState(true);

  // Load from backend API periodically or on mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchNotifications();
        // Since SSE pushes `NotificationPayload` and fetch returns `NotificationResponse`,
        // normalize the data shape to match NotificationPayload context
        const normalized = data.map((n: Record<string, unknown>) => ({
          id: String(n.id),
          type: String(n.type),
          message: n.type === 'FRIEND_REQUEST' ? 'sent you a friend request' : 'interacted with your profile',
          actorId: String(n.actorId || n.id), // fallback if needed
          actorName: String(n.actorName),
          timestamp: String(n.createdAt),
          relatedEntityId: String(n.relatedEntityId),
          isRead: Boolean(n.isRead),
        }));
        setNotifications(normalized);
      } catch (err) {
        console.error("Error loading notifications:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [setNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      markAsRead(id);
    } catch (e) {
      console.error(e);
    }
  };

  // Helper to remove a notification completely after processed
  const hideNotificationLocally = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleAcceptRequest = async (notificationId: string, requestId: string) => {
    try {
      // Optimistically hide the card so user can't double click
      hideNotificationLocally(notificationId);
      await acceptFriendRequest(requestId);
      await handleMarkAsRead(notificationId);
    } catch (e) {
      console.error(e);
      // We could revert the state here on fail, but let's keep it simple for now
    }
  };

  const handleDeclineRequest = async (notificationId: string, requestId: string) => {
    try {
      // Optimistically hide the card
      hideNotificationLocally(notificationId);
      await declineFriendRequest(requestId);
      await handleMarkAsRead(notificationId);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as
      | "dark"
      | "light"
      | null;
    if (savedTheme) {
      setTheme(savedTheme);
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

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0F0F1A] text-gray-900 dark:text-gray-100 relative selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-white transition-colors duration-300">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none bg-[#F8F9FA] dark:bg-[#0F0F1A] transition-colors duration-300">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 dark:bg-indigo-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 dark:bg-purple-900/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full flex justify-between items-start">
        <Sidebar />
        
        <div className="flex-1 w-full pb-32">
          <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl pb-32">
        {/* ── Top Navbar ────────────────────────────────── */}
        <div className="flex items-center justify-center mb-8 sticky top-0 z-50 bg-transparent dark:bg-[#0F0F1A]/80 backdrop-blur-md py-4 transition-colors duration-300">
        

          {/* Search */}
          <div className="hidden md:flex items-center gap-4 bg-gray-100 dark:bg-[#1A1A27] px-4 py-2 rounded-full border border-gray-200 dark:border-white/5 w-96 transition-colors duration-300">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search echoes..."
              className="bg-transparent border-none outline-none text-sm w-full text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
            />
          </div>

     
        </div>

        {/* ── Main Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          {/* ── Left Column: Activity Feed ──────────────── */}
          <div className="space-y-8">
            {/* Page header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Activity & Echoes
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Moments fleeting into the void.
              </p>
            </div>

            {/* ── Today ─────────────────────────────────── */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Live Feed
                  </h2>
                  <span className="text-xs font-semibold bg-indigo-600 text-white px-2.5 py-0.5 rounded-full">
                    {notifications.filter(n => !n.isRead).length} New
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-400 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-400 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ) : (
                <div className="mt-2 divide-y divide-gray-200 dark:divide-white/[0.04]">
                  {notifications.map((n, i) => {
                    if (n.type === 'FRIEND_REQUEST') {
                      return (
                        <div key={n.id || i} className="py-4 relative">
                          {!n.isRead && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full z-10"></div>
                          )}
                          <FriendRequestCard
                            name={n.actorName}
                            message="wants to resonate with your vibe."
                            imageUrl="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=400&auto=format&fit=crop"
                            onAccept={() => handleAcceptRequest(n.id as string, n.relatedEntityId as string)}
                            onDrift={() => handleDeclineRequest(n.id as string, n.relatedEntityId as string)}
                          />
                        </div>
                      );
                    }

                    const typeDisplay = n.type === 'FRIEND_REQUEST' ? 'mention' : 'faded';
                    return (
                      <div key={n.id || i} className="group relative cursor-pointer" onClick={() => n.id && !n.isRead && handleMarkAsRead(n.id)}>
                        {!n.isRead && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                        )}
                        <NotificationItem
                          type={typeDisplay as "mention" | "faded" | "like" | "reply"}
                          userName={n.actorName}
                          message={n.message}
                          timeAgo={new Date(n.timestamp).toLocaleDateString()}
                          avatarUrl={""} // TODO: DTO needs actor avatar mapped
                        />
                      </div>
                    );
                  })}
                  {notifications.length === 0 && (
                    <div className="text-gray-500 py-8 text-center italic">
                      No notifications yet.
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* ── Last Moments ──────────────────────────── */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Last Moments
              </h2>
              <div className="py-8 text-center">
                <p className="text-gray-600 dark:text-gray-500 italic text-sm">
                  Everything before this has faded into silence…
                </p>
              </div>
            </section>
          </div>

          {/* ── Right Sidebar ───────────────────────────── */}
          <aside className="hidden lg:block space-y-6">
            {/* Expiring Soon */}
            <div className="bg-white dark:bg-[#181825]/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-lg">🔥</span>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Expiring Soon
                </h3>
              </div>

              <div className="space-y-3">
                {EXPIRING_ITEMS.map((item) => (
                  <ExpiringItemCard
                    key={item.id}
                    timeLeft={item.timeLeft}
                    title={item.title}
                    subtitle={item.subtitle}
                    urgency={item.urgency}
                    hearts={item.hearts}
                    views={item.views}
                  />
                ))}
              </div>
            </div>

            {/* Suggested Connections */}
            <div className="bg-white dark:bg-[#181825]/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 dark:border-white/5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                Suggested Connections
              </h3>
              <div className="space-y-2">
                {SUGGESTED_CONNECTIONS.map((c) => (
                  <SuggestedConnectionItem
                    key={c.id}
                    name={c.name}
                    reason={c.reason}
                    avatarUrl={c.avatarUrl}
                    onConnect={() => {}}
                  />
                ))}
              </div>
            </div>
          </aside>
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
