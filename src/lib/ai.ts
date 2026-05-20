const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';

export const DEFAULT_MODEL = 'openai/gpt-4o-mini';

export type AIClientConfig = {
  apiKey: string;
  model?: string;
};

export type AIClient = {
  chat: (prompt: string) => Promise<string>;
};

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

export function createAIClient(config: AIClientConfig): AIClient {
  const model = config.model ?? DEFAULT_MODEL;

  return {
    async chat(prompt: string): Promise<string> {
      try {
        return await chatWithOpenRouter(config.apiKey, prompt, model);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        throw new Error(`AI request failed: ${message}`);
      }
    },
  };
}
