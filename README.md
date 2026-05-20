# AI LLM Library

A lightweight TypeScript library for LLM chat via [OpenRouter](https://openrouter.ai/), with a minimal Vite demo app.

## Setup

```bash
npm install
npm run dev
```

## Environment Setup

Create a `.env` file in the project root:

```env
VITE_OPENROUTER_API_KEY=your_key_here
```

Get a key at [openrouter.ai/keys](https://openrouter.ai/keys).

## Usage Example

```ts
import { createAIClient } from './lib/ai';

const ai = createAIClient({
  apiKey: 'YOUR_KEY',
});

const response = await ai.chat('Explain TypeScript simply');
console.log(response);
```

### Custom model

Browse models at [openrouter.ai/models](https://openrouter.ai/models), then pass the model id:

```ts
const ai = createAIClient({
  apiKey: 'YOUR_KEY',
  model: 'anthropic/claude-sonnet-4',
});
```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USER/ai-llm-library)

1. Push this repo to GitHub.
2. Import the project on [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects **Vite** (`vercel.json` is included).
4. Add an environment variable:

   | Name | Value |
   | --- | --- |
   | `OPENROUTER_API_KEY` | Your [OpenRouter](https://openrouter.ai/keys) key |

5. Deploy.

Production calls `/api/chat` (Edge Function) so your API key stays on the server. Local dev still uses `VITE_OPENROUTER_API_KEY` directly.

### Test production locally

```bash
npx vercel dev
```

## Project Structure

```
api/
└── chat.ts         # Vercel Edge API (production)
src/
├── lib/
│   ├── ai.ts       # Reusable AI client
│   └── chatApi.ts  # Dev vs production routing
├── App.tsx         # Demo UI
├── main.tsx
└── styles.css
vercel.json
```

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start dev server         |
| `npm run build`   | Type-check and build     |
| `npm run preview` | Preview production build |

## License

MIT
