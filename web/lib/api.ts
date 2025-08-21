// web/lib/api.ts
const DEFAULT_TIMEOUT_MS = 20_000;

async function apiFetch(path: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(`/api/backend${path}`, {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(init.headers || {}),
      },
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const err: any = new Error(`API ${res.status} ${res.statusText}${text ? `: ${text}` : ''}`);
      (err.status = res.status);
      throw err;
    }
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export type Reminder = {
  id: number;
  text: string;
  due_at: string | null;
  done: boolean;
  created_at: string;
};

// — Chat —
// 1) próba POST /ask {q}; 2) fallback GET /ask?q=...
export async function ask(q: string): Promise<string> {
  try {
    const res = await apiFetch('/ask', {
      method: 'POST',
      body: JSON.stringify({ q }),
    });
    return res.text();
  } catch (e: any) {
    if (e?.status === 405) {
      const res2 = await apiFetch(`/ask?q=${encodeURIComponent(q)}`, { method: 'GET' });
      return res2.text();
    }
    throw e;
  }
}

// — Reminders —
export async function getReminders(): Promise<Reminder[]> {
  const res = await apiFetch('/reminders', { method: 'GET' });
  return res.json() as Promise<Reminder[]>;
}

export async function createReminder(text: string, due_at?: string | null): Promise<Reminder> {
  const res = await apiFetch('/reminders', {
    method: 'POST',
    body: JSON.stringify({ text, due_at: due_at ?? null }),
  });
  return res.json() as Promise<Reminder>;
}

// Jeśli backend nie ma PATCH: fallback na POST /reminders/:id/done
export async function patchReminder(
  id: number,
  payload: Partial<Pick<Reminder, 'text' | 'due_at' | 'done'>>
): Promise<Reminder> {
  try {
    const res = await apiFetch(`/reminders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return res.json() as Promise<Reminder>;
  } catch (e: any) {
    if (e?.status === 405 && 'done' in payload) {
      const res2 = await apiFetch(`/reminders/${id}/done`, { method: 'POST' });
      return res2.json() as Promise<Reminder>;
    }
    throw e;
  }
}

// Jeśli backend nie ma DELETE: zwróć błąd z eleganckim komunikatem
export async function deleteReminder(id: number): Promise<{ ok: true }> {
  const res = await apiFetch(`/reminders/${id}`, { method: 'DELETE' }).catch((err) => {
    throw new Error(`Backend nie obsługuje DELETE /reminders/${id}: ${String(err)}`);
  });
  if (res.status === 204) return { ok: true };
  try {
    const j = await res.json();
    return j?.ok ? j : { ok: true };
  } catch {
    return { ok: true };
  }
}
