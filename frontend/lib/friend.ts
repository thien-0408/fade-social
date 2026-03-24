import { apiFetch } from "./api";
import { getAccessToken } from "./auth";
import { UserData } from "./user";

/* ── Friend API wrappers ──────────────────────────── */

export async function sendFriendRequest(userId: string): Promise<unknown> {
  const token = getAccessToken();
  const res = await apiFetch<unknown>(`/friendships/${userId}/send`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res;
}

export async function unfriend(userId: string): Promise<unknown> {
  const token = getAccessToken();
  const res = await apiFetch<unknown>(`/friendships/${userId}/unfriend`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res;
}

export async function getFriendshipStatus(userId: string): Promise<string> {
  const token = getAccessToken();
  const res = await apiFetch<{ code: number; result: string }>(`/friendships/status/${userId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.result;
}

export async function getMyFriends(): Promise<UserData[]> {
  const token = getAccessToken();
  const res = await apiFetch<{ code: number; result: UserData[] }>(`/friendships/friends`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.result || [];
}

export async function getUserFriends(userId: string): Promise<UserData[]> {
  const token = getAccessToken();
  const res = await apiFetch<{ code: number; result: UserData[] }>(`/friendships/${userId}/friends`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.result || [];
}

export async function acceptFriendRequest(requestId: string): Promise<unknown> {
  const token = getAccessToken();
  const res = await apiFetch<unknown>(`/friendships/requests/${requestId}/accept`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res;
}

export async function declineFriendRequest(requestId: string): Promise<unknown> {
  const token = getAccessToken();
  const res = await apiFetch<unknown>(`/friendships/requests/${requestId}/decline`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res;
}
