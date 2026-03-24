/**
 * Base API fetch utility.
 * All requests go through Next.js rewrites (/api/* → backend),
 * so we never hit CORS issues in the browser.
 */

export interface ApiError {
  code: number;
  message: string;
}

export class ApiRequestError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.code = code;
  }
}

/**
 * JSON API fetch — sets Content-Type: application/json automatically.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `/api${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  return handleResponse<T>(res);
}

/**
 * Multipart form-data fetch — does NOT set Content-Type
 * so the browser can set it with the correct boundary.
 * Automatically attaches the Authorization header if a token is provided.
 */
export async function apiFormFetch<T>(
  endpoint: string,
  formData: FormData,
  token?: string | null,
  method: string = "POST"
): Promise<T> {
  const url = `/api${endpoint}`;

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: formData,
  });

  return handleResponse<T>(res);
}

/* ── Shared response handler ───────────────────────────── */

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    if (!res.ok) {
      throw new ApiRequestError(res.status, `Server error (${res.status})`);
    }
  }

  const data = await res.json();

  if (!res.ok) {
    throw new ApiRequestError(
      data.code ?? res.status,
      data.message ?? "Something went wrong"
    );
  }

  return data as T;
}

