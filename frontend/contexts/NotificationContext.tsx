"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getAccessToken, isLoggedIn } from "../lib/auth";

export interface NotificationPayload {
  id?: string;
  type: string;
  message: string;
  actorId: string;
  actorName: string;
  timestamp: string;
  relatedEntityId?: string;
  isRead?: boolean;
}

interface NotificationContextType {
  notifications: NotificationPayload[];
  unreadCount: number;
  addNotification: (n: NotificationPayload) => void;
  markAsRead: (id: string) => void;
  setNotifications: (ns: NotificationPayload[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);

  const addNotification = (n: NotificationPayload) => {
    setNotifications((prev) => [n, ...prev]);
  };

  useEffect(() => {
    if (!isLoggedIn()) return;

    const token = getAccessToken();
    if (!token) return;

    // Connect to SSE using token via query param through Next.js rewrite proxy at /api/*
    const url = `/api/notifications/subscribe?token=${token}`;
    
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      console.log("SSE connected!");
    };

    eventSource.addEventListener("NOTIFICATION", (event) => {
      try {
        const payload = JSON.parse(event.data) as NotificationPayload;
        addNotification(payload);
      } catch (err) {
        console.error("Failed to parse SSE notification", err);
      }
    });

    eventSource.addEventListener("INIT", (event) => {
      console.log("SSE Init: ", event.data);
    });

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      eventSource.close(); // Close on error to prevent infinite reconnection loops sometimes
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
