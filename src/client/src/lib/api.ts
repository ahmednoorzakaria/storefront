export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("store_token");
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    throw new Error(typeof data === "object" && data.error ? data.error : "Request failed");
  }
  return data as T;
}

export function formatDate(value: string) {
  return new Date(value).toLocaleString();
}
