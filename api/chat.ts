export const config = { runtime: 'edge' };

const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-4o-mini';

type ChatResponse = {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
};

export default async function handler(request: Request) {
  try {
    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const apiKey = process.env['OPENROUTER_API_KEY']?.trim();
    if (!apiKey) {
      return Response.json(
        { error: 'OPENROUTER_API_KEY is not set in Vercel environment variables' },
        { status: 500 },
      );
    }

    let body: { prompt?: string; model?: string };
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const prompt = body.prompt?.trim();
    if (!prompt) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const res = await fetch(OPENROUTER_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://openrouter.ai',
        'X-Title': 'AI LLM Library',
      },
      body: JSON.stringify({
        model: body.model ?? DEFAULT_MODEL,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = (await res.json()) as ChatResponse;

    if (!res.ok) {
      return Response.json(
        { error: data.error?.message ?? `OpenRouter error (${res.status})` },
        { status: res.status },
      );
    }

    const text = data.choices?.[0]?.message?.content;
    if (!text) {
      return Response.json({ error: 'Empty response from model' }, { status: 502 });
    }

    return Response.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
