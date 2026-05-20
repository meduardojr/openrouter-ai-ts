import { chatWithOpenRouter, DEFAULT_MODEL } from '../src/lib/ai';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'OPENROUTER_API_KEY not configured' }, { status: 500 });
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
