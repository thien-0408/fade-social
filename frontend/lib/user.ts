import { apiFetch } from "./api";
import { getAccessToken } from "./auth";

/* ── Types ─────────────────────────────────────────────── */

export interface ProfileData {
  id: string;
  fullName: string;
  bio: string;
  phoneNumber: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string;
  avatarUrl: string | null;
  coverImageUrl: string | null;
}

export interface UserData {
  id: string;
  userName: string;
  email: string;
  role: string;
  status: string;
  profileResponse: ProfileData | null;
}

export interface PostOwner {
  id: string;
  userName: string;
  fullName: string;
  avatarUrl: string | null;
}

export interface PostData {
  id: string;
  owner: PostOwner;
  type: "THOUGHT" | "MEDIA";
  textContent: string | null;
  mediaUrl: string | null;
  loveCount: number;
  totalReactions: number;
  commentCount: number;
  ttlMinutes: number;
  currentReaction: string | null;
  createdAt: string;
  expiresAt: string | null;
}

export interface PageResponse<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  data: T[];
}

/* ── JWT helpers (decode without verification — it's for the client only) */

function parseJwtPayload(token: string): Record<string, unknown> {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return {};
  }
}

export function getCurrentUserId(): string | null {
  const token = getAccessToken();
  if (!token) return null;
  const payload = parseJwtPayload(token);
  return (payload.sub as string) ?? null;
}

export function getCurrentUsername(): string | null {
  const token = getAccessToken();
  if (!token) return null;
  const payload = parseJwtPayload(token);
  return (payload.username as string) ?? null;
}

/* ── API calls ─────────────────────────────────────────── */

/** Fetch a user by ID (requires auth) */
export async function getUserById(userId: string): Promise<UserData> {
  const token = getAccessToken();
  const res = await apiFetch<{ code: number; result: UserData }>(
    `/users/${userId}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.result;
}

/** Fetch the currently logged-in user */
export async function getCurrentUser(): Promise<UserData | null> {
  const userId = getCurrentUserId();
  if (!userId) return null;
  return getUserById(userId);
}

/** Fetch posts by user ID (flat list) */
export async function getPostsByUserId(userId: string): Promise<PostData[]> {
  const token = getAccessToken();
  const res = await apiFetch<{ code: number; result: PostData[] }>(
    `/posts/${userId}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.result;
}

/** Fetch posts by user ID (paginated) */
export async function getPostsByUserIdPaged(
  userId: string,
  page = 1,
  size = 10
): Promise<PageResponse<PostData>> {
  const token = getAccessToken();
  const res = await apiFetch<{ code: number; result: PageResponse<PostData> }>(
    `/posts/user/${userId}?page=${page}&size=${size}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.result;
}

/** Search users by username */
export async function searchUsers(query: string): Promise<UserData[]> {
  const token = getAccessToken();
  const res = await apiFetch<{ code: number; result: UserData[] }>(
    `/users/search?q=${encodeURIComponent(query)}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.result;
}

/** Fetch online users */
export async function getOnlineUsers(): Promise<UserData[]> {
  const token = getAccessToken();
  const res = await apiFetch<{ code: number; result: UserData[] }>(
    `/users/online`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.result;
}
