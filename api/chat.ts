import { chatWithOpenRouter, DEFAULT_MODEL } from '../src/lib/ai';

function getApiKey(): string | undefined {
  // Dynamic access so Vercel does not inline a missing value at build time
  return process.env['OPENROUTER_API_KEY']?.trim();
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return Response.json(
      { error: 'OPENROUTER_API_KEY is not set in Vercel environment variables' },
      { status: 500 },
    );
  }

  let body: { prompt?: string; model?: string };
  try {
    body = (await request.json()) as { prompt?: string; model?: string };
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt) {
    return Response.json({ error: 'Prompt is required' }, { status: 400 });
  }

  try {
    const text = await chatWithOpenRouter(
      apiKey,
      prompt,
      body.model ?? DEFAULT_MODEL,
    );
    return Response.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
