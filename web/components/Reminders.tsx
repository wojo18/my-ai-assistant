'use client';
import { useEffect, useState } from 'react';
import { createReminder, deleteReminder, getReminders, patchReminder, Reminder } from '../lib/api';

export default function Reminders() {
  const [items, setItems] = useState<Reminder[]>([]);
  const [text, setText] = useState('');
  const [dueAt, setDueAt] = useState('');

  async function refresh(){ setItems(await getReminders()); }
  useEffect(()=>{ refresh(); },[]);

  async function add(){
    if(!text.trim()) return;
    await createReminder(text.trim(), dueAt || undefined);
    setText(''); setDueAt('');
    await refresh();
  }

  async function toggleDone(it: Reminder){
    await patchReminder(it.id, { done: !it.done });
    await refresh();
  }

  async function remove(id:number){
    await deleteReminder(id); await refresh();
  }

  return (
    <div className="card">
      <h2>Przypomnienia</h2>
      <div className="row">
        <input placeholder="Treść" value={text} onChange={e=>setText(e.target.value)} style={{flex:1}} />
        <input type="datetime-local" value={dueAt} onChange={e=>setDueAt(e.target.value)} />
        <button onClick={add}>Dodaj</button>
      </div>
      <div className="list">
        {items.map(it => (
          <div key={it.id} className="row" style={{justifyContent:'space-between'}}>
            <label style={{display:'flex',gap:8,alignItems:'center'}}>
              <input type="checkbox" checked={it.done} onChange={()=>toggleDone(it)} />
              <span>{it.text}</span>
            </label>
            <div style={{display:'flex',gap:8}}>
              {it.due_at && <small>{new Date(it.due_at).toLocaleString()}</small>}
              <button onClick={()=>remove(it.id)}>Usuń</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
