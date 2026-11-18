import { supabase } from "./supabase";

export type Task = {
  id: string; title: string; notes: string; difficulty: "Easy" | "Medium" | "Hard";
  estimate: number; deadline: string | null; status: "To do" | "In progress" | "Done"; createdAt: string;
};

export async function apiResponse(path: string, options?: RequestInit): Promise<Response> {
  const session = supabase ? (await supabase.auth.getSession()).data.session : null;
  const headers = new Headers(options?.headers);
  if (!headers.has("Content-Type") && options?.body) headers.set("Content-Type", "application/json");
  if (session?.access_token) headers.set("Authorization", `Bearer ${session.access_token}`);
  const response = await fetch(`/api${path}`, { ...options, headers });
  if (response.status === 401 && supabase) await supabase.auth.signOut();
  return response;
}

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await apiResponse(path, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "The request failed.");
  return data as T;
}
