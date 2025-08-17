export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiAsk(prompt: string): Promise<string> {
  const r = await fetch(`${API_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!r.ok) throw new Error("Ask failed");
  const data = await r.json();
  return data.answer;
}

export type Reminder = {
  id: number; text: string; due_at?: string | null; done: boolean; created_at: string; updated_at: string;
};

export async function getReminders(): Promise<Reminder[]> {
  const r = await fetch(`${API_URL}/reminders`, { cache: "no-store" });
  if (!r.ok) throw new Error("List failed");
  return r.json();
}

export async function createReminder(text: string, due_at?: string) {
  const r = await fetch(`${API_URL}/reminders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, due_at: due_at || null }),
  });
  if (!r.ok) throw new Error("Create failed");
  return r.json();
}

export async function patchReminder(id: number, body: Partial<Reminder>) {
  const r = await fetch(`${API_URL}/reminders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error("Patch failed");
  return r.json();
}

export async function deleteReminder(id: number) {
  const r = await fetch(`${API_URL}/reminders/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("Delete failed");
  return r.json();
}
