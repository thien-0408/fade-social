import { apiFetch } from "./api";
import { getAccessToken } from "./auth";

export type ReactionType = "LOVE";

export async function toggleReaction(postId: string, type: ReactionType): Promise<void> {
  const token = getAccessToken();
  await apiFetch(`/posts/${postId}/reactions?type=${type}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
