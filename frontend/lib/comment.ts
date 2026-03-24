import { apiFetch } from "./api";
import { getAccessToken } from "./auth";
import { PageResponse } from "./user";

export interface CommentOwner {
  id: string;
  userName: string;
  fullName: string;
  avatarUrl: string | null;
}

export interface CommentData {
  id: string;
  owner: CommentOwner;
  postId: string;
  content: string;
  createdAt: string;
}

export async function addComment(postId: string, content: string): Promise<CommentData> {
  const token = getAccessToken();
  const res = await apiFetch<{ code: number; result: CommentData; message: string }>(
    `/comments/${postId}`,
    {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify({ content }),
    }
  );
  return res.result;
}

export async function getCommentsByPostId(
  postId: string,
  page = 1,
  size = 10
): Promise<PageResponse<CommentData>> {
  const token = getAccessToken();
  const res = await apiFetch<{ code: number; result: PageResponse<CommentData>; message: string }>(
    `/comments/${postId}?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.result;
}
