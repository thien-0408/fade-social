"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import CreateWhisperModal from "./CreateWhisperModal";
import { getCurrentUser, UserData } from "@/lib/user";
import { logout } from "@/lib/auth";
import { useLoader } from "../contexts/LoaderContext";

export function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
    return url;
  }
  return `/${url}`;
}

interface SidebarProps {
  onPostCreated?: () => void;
}

export default function Sidebar({ onPostCreated }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [showWhisperModal, setShowWhisperModal] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const { startLoading } = useLoader();

    useEffect(() => {
        getCurrentUser().then(u => setUser(u)).catch(() => {});
    }, []);

    const avatarUrl =
      normalizeImageUrl(user?.profileResponse?.avatarUrl) ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.userName || "anon"}`;

    const handleLogoutConfirm = () => {
        startLoading(500);
        logout();
        router.push("/login");
    };

    const handleSuccessCreate = () => {
        setShowWhisperModal(false);
        if (onPostCreated) {
            onPostCreated();
        } else {
            router.push("/home");
        }
    };

    return (
        <>
            <div className="hidden md:flex flex-col w-[244px] shrink-0 sticky top-0 h-screen py-8 px-6 border-r border-gray-200 dark:border-white/10 bg-[#FDFDFD] dark:bg-[#0c1014] z-40">
                 <div className="flex items-center gap-3 mb-10 pl-2">
                     <div className="w-10 h-10 relative flex items-center justify-center">
                         <Image src="/Logo.png" alt="Fade Logo" fill className="object-contain" priority />
                     </div>
                     <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">FADE</span>
                 </div>

                 <nav className="flex flex-col gap-2 flex-1">
                     <button onClick={() => router.push('/home')} className={`flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition group w-full text-left ${pathname === '/home' ? 'font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-white/5' : 'font-medium text-gray-600 dark:text-gray-300'}`}>
                         <svg className="w-6 h-6 group-hover:scale-110 transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                         Home
                     </button>
                     <button className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition group w-full text-left font-medium text-gray-600 dark:text-gray-300">
                         <svg className="w-6 h-6 group-hover:scale-110 transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                         Search
                     </button>
                     <button onClick={() => router.push('/messages')} className={`flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition group w-full text-left ${pathname.includes('/messages') ? 'font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-white/5' : 'font-medium text-gray-600 dark:text-gray-300'}`}>
                         <svg className="w-6 h-6 group-hover:scale-110 transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                         Messages
                     </button>
                     <button onClick={() => router.push('/activity')} className={`flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition group w-full text-left ${pathname.includes('/activity') ? 'font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-white/5' : 'font-medium text-gray-600 dark:text-gray-300'}`}>
                         <svg className="w-6 h-6 group-hover:scale-110 transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                         Notifications
                     </button>
                     <button onClick={() => setShowWhisperModal(true)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition group w-full text-left font-medium text-gray-600 dark:text-gray-300">
                         <svg className="w-6 h-6 group-hover:scale-110 transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                         Create
                     </button>
                     <button onClick={() => router.push('/profile')} className={`flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition group w-full text-left mt-2 ${pathname.includes('/profile') ? 'font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-white/5' : 'font-medium text-gray-600 dark:text-gray-300'}`}>
                         <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                             <Image src={avatarUrl} alt="Profile" width={24} height={24} className="w-full h-full object-cover" />
                         </div>
                         Profile
                     </button>

                     {/* Spacer to push Logout to bottom */}
                     <div className="flex-1"></div>

                     {/* Logout Button */}
                     <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 transition group w-full text-left font-medium mt-auto mb-2">
                         <svg className="w-6 h-6 group-hover:scale-110 transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                         Logout
                     </button>
                 </nav>
            </div>

            <CreateWhisperModal 
                isOpen={showWhisperModal} 
                onClose={() => setShowWhisperModal(false)} 
                user={user} 
                onSuccess={handleSuccessCreate} 
            />

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center animate-fadeIn p-4">
                    <div className="bg-white dark:bg-[#181825] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 animate-slideUp">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Log Out</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Are you sure you want to let your session fade away? You will need to sign back in.</p>
                        </div>
                        <div className="flex border-t border-gray-200 dark:border-white/10">
                            <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-4 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition">Cancel</button>
                            <div className="w-px bg-gray-200 dark:bg-white/10"></div>
                            <button onClick={handleLogoutConfirm} className="flex-1 py-4 text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition">Log Out</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
