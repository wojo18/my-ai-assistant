// web/lib/api.ts

// ———————————————————————————————————————
// Konfiguracja fetch + timeout
// ———————————————————————————————————————
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
      throw new Error(`API ${res.status} ${res.statusText}${text ? `: ${text}` : ''}`);
    }
    return res;
  } finally {
    clearTimeout(timer);
  }
}

// ———————————————————————————————————————
// Typy (dopasowane do backendu reminders)
// ———————————————————————————————————————
export type Reminder = {
  id: number;
  text: string;
  due_at: string | null;     // ISO datetime lub null
  done: boolean;
  created_at: string;        // ISO datetime
};

// ———————————————————————————————————————
// Chat /ask
// ———————————————————————————————————————
export async function ask(q: string): Promise<string> {
  const res = await apiFetch('/ask', {
    method: 'POST',
    body: JSON.stringify({ q }),
  });
  return res.text();
}

// ———————————————————————————————————————
// Reminders CRUD (front oczekuje nazw: getReminders, createReminder, patchReminder, deleteReminder)
// Back-end (warianty):
//  - GET/POST /reminders
//  - PATCH /reminders/:id          (opcjonalnie – jeśli masz)
//  - DELETE /reminders/:id         (opcjonalnie – jeśli masz)
//  - POST   /reminders/:id/done    (jeśli zamiast PATCH masz osobny endpoint do oznaczania jako zrobione)
// Poniższe funkcje obsługują oba warianty.
// ———————————————————————————————————————
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

/**
 * Aktualizacja przypomnienia.
 * Jeśli przekażesz { done: true/false } i backend nie ma PATCH /reminders/:id,
 * spróbujemy POST /reminders/:id/done jako fallback.
 */
export async function patchReminder(
  id: number,
  payload: Partial<Pick<Reminder, 'text' | 'due_at' | 'done'>>
): Promise<Reminder> {
  // Najpierw spróbuj klasycznego PATCH /reminders/:id
  try {
    const res = await apiFetch(`/reminders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return res.json() as Promise<Reminder>;
  } catch (err) {
    // Fallback: jeśli backend ma tylko /reminders/:id/done (POST)
    if (Object.prototype.hasOwnProperty.call(payload, 'done')) {
      const res2 = await apiFetch(`/reminders/${id}/done`, {
        method: 'POST',
      });
      return res2.json() as Promise<Reminder>;
    }
    throw err;
  }
}

export async function deleteReminder(id: number): Promise<{ ok: true }> {
  // Standard: DELETE /reminders/:id
  const res = await apiFetch(`/reminders/${id}`, { method: 'DELETE' }).catch(async (err) => {
    // Fallback: jeśli nie ma DELETE – zwróć błąd z informacją
    throw new Error(`DELETE /reminders/${id} niedostępne na backendzie: ${String(err)}`);
  });
  // Jeżeli backend zwraca pustą odpowiedź 204, zwróć stały obiekt
  if (res.status === 204) return { ok: true };
  try {
    const j = await res.json();
    return j?.ok ? j : { ok: true };
  } catch {
    return { ok: true };
  }
}
