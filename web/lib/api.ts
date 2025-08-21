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

export async function ask(q: string): Promise<string> {
  const res = await apiFetch('/ask', {
    method: 'POST',
    body: JSON.stringify({ q }),
  });
  return res.text();
}
