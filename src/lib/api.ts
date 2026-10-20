export const API_URL = "http://localhost:3000";

export class ApiError extends Error {
  status: number;
  issues?: { path: (string | number)[]; message: string }[];

  constructor(status: number, message: string, issues?: ApiError["issues"]) {
    super(message);
    this.status = status;
    this.issues = issues;
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(
      res.status,
      data?.error ?? "Something went wrong",
      data?.issues,
    );
  }
  return data as T;
}
