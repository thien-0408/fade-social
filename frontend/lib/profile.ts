import { apiFormFetch } from "./api";
import { getAccessToken } from "./auth";

/* ── Types ─────────────────────────────────────────────── */

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface ProfileData {
  bio: string;
  fullName: string;
  phoneNumber: string;
  gender: Gender;
  dateOfBirth: string; // "YYYY-MM-DD"
  avatar?: File | null;
  coverImage?: File | null;
}

export interface ProfileResponse {
  id: string;
  fullName: string;
  bio: string;
  phoneNumber: string;
  gender: Gender;
  dateOfBirth: string;
  avatarUrl: string | null;
  coverImageUrl: string | null;
}

/* ── API function ──────────────────────────────────────── */

export async function createProfile(
  data: ProfileData
): Promise<ProfileResponse> {
  const formData = new FormData();
  formData.append("bio", data.bio);
  formData.append("fullName", data.fullName);
  formData.append("phoneNumber", data.phoneNumber);
  formData.append("gender", data.gender);
  formData.append("dateOfBirth", data.dateOfBirth);

  if (data.avatar) {
    formData.append("avatar", data.avatar);
  }
  if (data.coverImage) {
    formData.append("coverImage", data.coverImage);
  }

  return apiFormFetch<ProfileResponse>(
    "/profiles/create",
    formData,
    getAccessToken()
  );
}

export async function updateProfile(
  data: ProfileData
): Promise<ProfileResponse> {
  const formData = new FormData();
  formData.append("bio", data.bio);
  formData.append("fullName", data.fullName);
  formData.append("phoneNumber", data.phoneNumber);
  formData.append("gender", data.gender);
  formData.append("dateOfBirth", data.dateOfBirth);

  if (data.avatar) {
    formData.append("avatar", data.avatar);
  }
  if (data.coverImage) {
    formData.append("coverImage", data.coverImage);
  }

  return apiFormFetch<ProfileResponse>(
    "/profiles/update",
    formData,
    getAccessToken(),
    "PUT"
  );
}
