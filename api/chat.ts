import type { VercelRequest, VercelResponse } from '@vercel/node';
import { chatWithOpenRouter, DEFAULT_MODEL } from '../src/lib/ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env['OPENROUTER_API_KEY']?.trim();
  if (!apiKey) {
    return res.status(500).json({
      error: 'OPENROUTER_API_KEY is not set in Vercel environment variables',
    });
  }

  const { prompt, model } = req.body as { prompt?: string; model?: string };
  const trimmed = prompt?.trim();
  if (!trimmed) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const text = await chatWithOpenRouter(apiKey, trimmed, model ?? DEFAULT_MODEL);
    return res.status(200).json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
