import { createAIClient } from './ai';

const devClient = import.meta.env.DEV
  ? createAIClient({ apiKey: import.meta.env.VITE_OPENROUTER_API_KEY })
  : null;

export async function sendChat(prompt: string): Promise<string> {
  if (devClient) {
    return devClient.chat(prompt);
  }

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  const data = (await res.json()) as { text?: string; error?: string };
  if (!res.ok) throw new Error(data.error ?? 'Request failed');
  if (!data.text) throw new Error('Empty response');
  return data.text;
}
