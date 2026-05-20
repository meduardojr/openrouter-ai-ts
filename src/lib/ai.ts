const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';

export const DEFAULT_MODEL = 'openai/gpt-4o-mini';

type ChatResponse = {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
};

export async function chatWithOpenRouter(
  apiKey: string,
  prompt: string,
  model: string = DEFAULT_MODEL,
): Promise<string> {
  const res = await fetch(OPENROUTER_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://openrouter.ai',
      'X-Title': 'AI LLM Library',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = (await res.json()) as ChatResponse;

  if (!res.ok) {
    throw new Error(data.error?.message ?? `Request failed (${res.status})`);
  }

  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response from model');
  return text;
}
