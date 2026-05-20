# AI LLM Library

A lightweight TypeScript app for LLM chat via [OpenRouter](https://openrouter.ai/), built with Vite and deployed on Vercel.

## Setup

```bash
npm install
```

Create a `.env` file:

```env
OPENROUTER_API_KEY=your_key_here
```

```bash
npm run dev
```

Opens **http://localhost:5173** with the Vite app and a local `/api/chat` server (same logic as production).

Check the key locally: **http://localhost:5173/api/chat**

## Environment

Use one variable everywhere (local `.env` and Vercel):

| Variable | Where |
| --- | --- |
| `OPENROUTER_API_KEY` | `.env` (local) and Vercel project settings (production) |

Get a key at [openrouter.ai/keys](https://openrouter.ai/keys).

On Vercel: **Settings → Environment Variables** → add `OPENROUTER_API_KEY` (no quotes). Enable for **Production** and **Preview**, then **redeploy**.

Check on Vercel: `https://your-app.vercel.app/api/chat` → `{"configured":true,...}`

## Deploy to Vercel

1. Push to GitHub.
2. Import at [vercel.com/new](https://vercel.com/new).
3. Set `OPENROUTER_API_KEY` in environment variables.
4. Deploy.

The API key stays server-side in `api/chat.js` — never exposed to the browser.

## Project Structure

```
api/
└── chat.js         # Vercel serverless API (production)
lib/
└── openrouter.cjs  # Shared API logic (local + Vercel)
src/
├── lib/ai.ts       # Optional copy-paste helper
├── App.tsx
├── main.tsx
└── styles.css
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Local Vite dev server + `/api/chat` |
| `npm run build` | Type-check and production build |
