const DEFAULT_TIMEOUT = 20000;

export async function apiFetch(path: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
  try {
    const res = await fetch(`/api/backend${path}`, {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(init.headers || {}),
      },
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`API ${res.status}: ${txt}`);
    }
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function remindersList() {
  const res = await apiFetch('/reminders', { method: 'GET' });
  return res.json() as Promise<Array<{id:number;text:string;due_at:string|null;done:boolean;created_at:string}>>;
}
export async function remindersCreate(text: string, due_at?: string) {
  const res = await apiFetch('/reminders', {
    method: 'POST',
    body: JSON.stringify({ text, due_at: due_at ?? null }),
  });
  return res.json();
}

