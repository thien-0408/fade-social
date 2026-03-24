import { apiFetch } from "./api";

/* ── Types ─────────────────────────────────────────────── */

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  userName: string;
  email: string;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

/* ── Storage keys ──────────────────────────────────────── */

const ACCESS_TOKEN_KEY = "fade_access_token";
const REFRESH_TOKEN_KEY = "fade_refresh_token";

/* ── Auth API functions ────────────────────────────────── */

export async function register(
  data: RegisterRequest
): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const tokens = await apiFetch<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  // Persist tokens
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);

  return tokens;
}

/* ── Token helpers ─────────────────────────────────────── */

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function logout(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return !!getAccessToken();
}
