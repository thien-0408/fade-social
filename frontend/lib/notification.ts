import { getAccessToken } from "./auth";

export async function fetchNotifications() {
  const token = getAccessToken();
  if (!token) return [];

  // Use Next.js rewrite proxy at /api/*
  const res = await fetch(`/api/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch notifications");
  }

  const data = await res.json();
  return data.result;
}

export async function markNotificationAsRead(id: string) {
  const token = getAccessToken();
  if (!token) return;

  const res = await fetch(`/api/notifications/${id}/read`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to mark notification as read");
  }
}
