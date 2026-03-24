import { apiFetch, apiFormFetch } from "./api";
import { getAccessToken } from "./auth";
import { PostData, PageResponse } from "./user";

export async function createPost(
  type: string,
  content?: string,
  mediaFile?: File | null,
  ttlMinutes?: number
): Promise<PostData> {
  const formData = new FormData();
  formData.append("type", type);
  if (content) {
    formData.append("content", content);
  }
  if (mediaFile) {
    formData.append("mediaFile", mediaFile);
  }
  if (ttlMinutes !== undefined) {
    formData.append("ttlMinutes", ttlMinutes.toString());
  }

  const res = await apiFormFetch<{ code: number; result: PostData; message: string }>(
    "/posts/upload",
    formData,
    getAccessToken(),
    "POST"
  );
  return res.result;
}

export async function deletePost(postId: string): Promise<void> {
  const token = getAccessToken();
  await apiFetch(`/posts/${postId}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function updatePost(
  postId: string,
  content?: string,
  mediaFile?: File | null
): Promise<PostData> {
  const formData = new FormData();
  if (content !== undefined) {
    formData.append("content", content);
  }
  if (mediaFile) {
    formData.append("mediaFile", mediaFile);
  }

  const res = await apiFormFetch<{ code: number; result: PostData; message: string }>(
    `/posts/${postId}`,
    formData,
    getAccessToken(),
    "PUT"
  );
  return res.result;
}

export async function getFeedPosts(page: number = 1, size: number = 10): Promise<PageResponse<PostData>> {
  const token = getAccessToken();
  const res = await apiFetch<{ code: number; result: PageResponse<PostData>; message: string }>(
    `/posts/feed?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.result;
}
