"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface LoaderContextType {
  startLoading: (durationMs?: number) => void;
  stopLoading: () => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true); // Initial load is true
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Trigger loader on route changes
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsLoading(true);
  }

  // Handle the 0.5s timer
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500); // 0.5s timer as requested
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const startLoading = (durationMs: number = 500) => {
    setIsLoading(true);
    if (durationMs > 0) {
      setTimeout(() => {
        setIsLoading(false);
      }, durationMs);
    }
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return (
    <LoaderContext.Provider value={{ startLoading, stopLoading }}>
      {children}
      
      {/* Global Loader Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white/95 dark:bg-[#05050A]/95 backdrop-blur-md transition-opacity duration-300">
           <div className="relative flex items-center justify-center w-20 h-20">
              {/* Spinning outer ring */}
              <div className="absolute inset-0 rounded-full border-[3px] border-indigo-100 dark:border-indigo-900/30"></div>
              <div className="absolute inset-0 rounded-full border-[3px] border-indigo-600 dark:border-indigo-500 border-t-transparent animate-spin"></div>
              
              {/* Inner glowing core */}
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-600/10 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                 <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
              </div>
           </div>
           
           <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-indigo-600/80 dark:text-indigo-400/80 uppercase animate-pulse">
              Fading...
           </p>
        </div>
      )}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);
  if (context === undefined) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
}
