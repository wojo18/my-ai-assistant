'use client';
import { useState } from 'react';
import { ask } from '@/lib/api';

export default function Chat() {
  const [q, setQ] = useState('');
  const [a, setA] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    setA(null);
    try {
      const answer = await ask(q);
      setA(answer);
    } catch (err: any) {
      setA(`Błąd: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 space-y-4">
      <form onSubmit={onSend} className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Zadaj pytanie..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          disabled={loading}
        >
          {loading ? '...' : 'Wyślij'}
        </button>
      </form>
      {a && (
        <div className="border rounded p-3 whitespace-pre-wrap">{a}</div>
      )}
    </div>
  );
}
