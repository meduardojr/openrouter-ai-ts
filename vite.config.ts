import { createRequire } from 'node:module';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const require = createRequire(import.meta.url);

function apiChatPlugin(env: Record<string, string>): Plugin {
  const { createHandler, normalizeKey } = require('./lib/openrouter.cjs');

  const handler = createHandler(() => ({
    apiKey: normalizeKey(env.OPENROUTER_API_KEY),
    referer: 'http://localhost:5173',
  }));

  return {
    name: 'api-chat',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0];
        if (path !== '/api/chat') return next();
        handler(req, res);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), apiChatPlugin(env)],
  };
});
