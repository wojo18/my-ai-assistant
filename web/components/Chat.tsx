'use client';
import { useState } from 'react';
import { apiAsk } from '../lib/api';

export default function Chat() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{role:'user'|'assistant';content:string}[]>([]);
  const [loading, setLoading] = useState(false);

  async function onSend() {
    if (!input.trim()) return;
    const prompt = input.trim();
    setInput('');
    setHistory(h => [...h, { role: 'user', content: prompt }]);
    setLoading(true);
    try {
      const answer = await apiAsk(prompt);
      setHistory(h => [...h, { role: 'assistant', content: answer }]);
    } catch (e:any) {
      setHistory(h => [...h, { role: 'assistant', content: 'Błąd: ' + (e?.message || 'nieznany') }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Chat</h2>
      <div className="list" style={{minHeight:120}}>
        {history.map((m, i) => (
          <div key={i} className="row">
            <b>{m.role === 'user' ? 'Ty:' : 'AI:'}</b>
            <div>{m.content}</div>
          </div>
        ))}
      </div>
      <div className="row">
        <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Napisz wiadomość..." rows={3} style={{flex:1}} />
        <button onClick={onSend} disabled={loading}>{loading ? '...' : 'Wyślij'}</button>
      </div>
    </div>
  );
}
