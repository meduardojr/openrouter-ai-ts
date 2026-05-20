const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-4o-mini';

function normalizeKey(raw) {
  let key = (raw ?? '').trim().replace(/^["']|["']$/g, '');
  if (key.toLowerCase().startsWith('bearer ')) key = key.slice(7).trim();
  return key;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function createHandler(getConfig) {
  return async (req, res) => {
    const { apiKey, referer } = getConfig();

    if (req.method === 'GET') {
      return sendJson(res, 200, {
        configured: Boolean(apiKey),
        apiKey: apiKey || '(empty)',
        keyLength: apiKey.length,
        authHeader: apiKey ? `Bearer ${apiKey}` : '(missing)',
        referer,
      });
    }

    if (req.method !== 'POST') {
      return sendJson(res, 405, { error: 'Method not allowed' });
    }

    if (!apiKey) {
      return sendJson(res, 500, {
        error: 'OPENROUTER_API_KEY is missing. Add it to .env locally or Vercel env vars, then restart.',
      });
    }

    const body = await readBody(req);
    const trimmed = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (!trimmed) {
      return sendJson(res, 400, { error: 'Prompt is required' });
    }

    try {
      const response = await fetch(OPENROUTER_API, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': referer,
          'X-Title': 'AI LLM Library',
        },
        body: JSON.stringify({
          model: body.model ?? DEFAULT_MODEL,
          messages: [{ role: 'user', content: trimmed }],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return sendJson(res, response.status, {
          error: data?.error?.message ?? `OpenRouter error (${response.status})`,
        });
      }

      const text = data?.choices?.[0]?.message?.content;
      if (!text) {
        return sendJson(res, 502, { error: 'Empty response from model' });
      }

      return sendJson(res, 200, { text });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return sendJson(res, 500, { error: message });
    }
  };
}

module.exports = { createHandler, normalizeKey, DEFAULT_MODEL };
