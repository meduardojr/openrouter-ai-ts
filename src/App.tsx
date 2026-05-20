import { useEffect, useState } from 'react';

type DebugInfo = {
  configured: boolean;
  apiKey: string;
  keyLength: number;
  authHeader: string;
  referer: string;
};

async function fetchDebug(): Promise<DebugInfo> {
  const res = await fetch('/api/chat');
  const raw = await res.text();
  return JSON.parse(raw) as DebugInfo;
}

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
  const [debug, setDebug] = useState<DebugInfo | null>(null);
  const [debugError, setDebugError] = useState('');

  useEffect(() => {
    fetchDebug()
      .then(setDebug)
      .catch((err) =>
        setDebugError(err instanceof Error ? err.message : 'Debug fetch failed'),
      );
  }, []);

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

      <div className="output debug">
        <h2>Debug (remove before production)</h2>
        {debugError && <p className="error-text">{debugError}</p>}
        {debug && (
          <>
            <p>
              <strong>Configured:</strong> {String(debug.configured)}
            </p>
            <p>
              <strong>Key length:</strong> {debug.keyLength}
            </p>
            <p>
              <strong>API key:</strong>
            </p>
            <pre>{debug.apiKey}</pre>
            <p>
              <strong>Auth header sent:</strong>
            </p>
            <pre>{debug.authHeader}</pre>
            <p>
              <strong>Referer:</strong> {debug.referer}
            </p>
          </>
        )}
      </div>

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
