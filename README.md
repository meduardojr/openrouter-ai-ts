# AI LLM Library

A lightweight TypeScript app for LLM chat via [OpenRouter](https://openrouter.ai/), built with Vite and deployed on Vercel.

## Setup

```bash
npm install
npm run dev
```

`npm run dev` runs [Vercel Dev](https://vercel.com/docs/cli/dev), which serves the Vite app and the `/api/chat` Edge Function together.

## Environment

Use one variable everywhere (local `.env` and Vercel project settings):

```env
OPENROUTER_API_KEY=your_key_here
```

Get a key at [openrouter.ai/keys](https://openrouter.ai/keys).

On Vercel: **Project → Settings → Environment Variables** → add `OPENROUTER_API_KEY`.

## Deploy to Vercel

1. Push to GitHub.
2. Import at [vercel.com/new](https://vercel.com/new) (Vite is auto-detected).
3. Set `OPENROUTER_API_KEY` in environment variables.
4. Deploy.

The API key stays server-side in `api/chat.ts` — it is never sent to the browser.

## Project Structure

```
api/
└── chat.ts         # Vercel Edge API
src/
├── lib/
│   └── ai.ts       # OpenRouter request helper
├── App.tsx
├── main.tsx
└── styles.css
```

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Local dev (Vite + API via Vercel CLI) |
| `npm run build` | Type-check and production build      |
