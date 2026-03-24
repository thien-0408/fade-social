"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useNotifications } from "../contexts/NotificationContext";
import { logout } from "../lib/auth";
import { useLoader } from "../contexts/LoaderContext";
import { useHeartbeat } from "../hooks/useHeartbeat";

export default function FloatingNavbar() {
  useHeartbeat(); // sends heartbeat every 45s if authenticated 
  
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { unreadCount } = useNotifications();
  const { startLoading } = useLoader();

  const navItems: Array<{ name: string; href?: string; action?: () => void; icon: React.ReactNode; highlighted?: boolean }> = [
    {
      name: "Home",
      href: "/home",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: "Messages",
      href: "/messages",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    // {
    //   name: "Posts",
    //   href: "/posts",
    //   icon: (
    //     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    //     </svg>
    //   ),
    // },
    // {
    //   name: "Create",
    //   href: "/create",
    //   icon: (
    //     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    //     </svg>
    //   ),
    //   highlighted: true,
    // },
    {
      name: "Activity",
      href: "/activity",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      name: "Profile",
      href: "/profile",
      icon: (
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-[#0f172a]"></span>
            </span>
          )}
        </div>
      ),
    },
    {
      name: "Logout",
      action: () => setShowLogoutConfirm(true),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
    },
  ];

  const handleLogoutConfirm = () => {
    startLoading(500);
    logout();
    router.push("/login");
  };

  return (
    <>
      {/* Label that appears on hover */}
      {hoveredIndex !== null && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
          <div className="bg-[#0f172a] text-white px-4 py-2 rounded-lg shadow-2xl border border-white/10 animate-fadeIn">
            <p className="text-sm font-medium">{navItems[hoveredIndex].name}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {navItems[hoveredIndex].name === "Home" ? "Go to homepage" : `View ${navItems[hoveredIndex].name.toLowerCase()}`}
            </p>
          </div>
        </div>
      )}

      {/* Floating Navigation Bar */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9998]">
        <div className="relative">
          {/* Glass background with blur */}
          <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl shadow-black/50"></div>
          
          {/* Navigation items */}
          <div className="relative flex items-center gap-2 px-6 py-4">
            {navItems.map((item, index) => {
              const isActive = item.href ? pathname === item.href : false;
              
              const innerContent = (
                <>
                  {/* Icon button */}
                  <div
                    className={`
                      relative w-14 h-14 flex items-center justify-center rounded-full
                      transition-all duration-300 ease-out
                      ${isActive 
                        ? 'bg-white text-[#0f172a] shadow-lg shadow-white/20' 
                        : 'bg-transparent text-white border-2 border-white/20 hover:border-white/40'
                      }
                      ${item.highlighted && !isActive ? 'bg-indigo-600/20 border-indigo-400/40' : ''}
                      group-hover:scale-110 group-hover:-translate-y-1
                    `}
                  >
                    {item.icon}
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>

                  {/* Glow effect on hover */}
                  <div className={`
                    absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    ${isActive ? 'bg-white/10' : 'bg-indigo-500/10'}
                    blur-xl -z-10
                  `}></div>
                </>
              );

              return item.href ? (
                <Link
                  key={`link-${index}`}
                  href={item.href}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="group relative"
                >
                  {innerContent}
                </Link>
              ) : (
                <button
                  key={`btn-${index}`}
                  onClick={item.action}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="group relative text-red-400 hover:text-red-500"
                >
                  {innerContent}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

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
