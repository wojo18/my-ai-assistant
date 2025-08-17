const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000'; // Android emulator

export async function apiAsk(prompt: string): Promise<string> {
  const r = await fetch(`${API_URL}/ask`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt })
  });
  const data = await r.json();
  return data.answer;
}
