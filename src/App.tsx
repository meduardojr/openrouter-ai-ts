import { useState } from 'react';

async function sendChat(prompt: string): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  const raw = await res.text();
  let data: { text?: string; error?: string };
  try {
    data = JSON.parse(raw) as { text?: string; error?: string };
  } catch {
    throw new Error(raw.slice(0, 200) || `Request failed (${res.status})`);
  }

  if (!res.ok) throw new Error(data.error ?? 'Request failed');
  if (!data.text) throw new Error('Empty response');
  return data.text;
}

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const result = await sendChat(prompt.trim());
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>AI Chat</h1>
        <p>Minimal OpenRouter integration demo</p>
      </header>

      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt">Your prompt</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask anything..."
          rows={4}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !prompt.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {error && (
        <div className="output error" role="alert">
          {error}
        </div>
      )}

      {response && (
        <div className="output">
          <h2>Response</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
