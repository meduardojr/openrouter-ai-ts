import { useState } from 'react';
import { sendChat } from './lib/chatApi';

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
