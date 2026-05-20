const { createHandler, normalizeKey } = require('../lib/openrouter.cjs');

module.exports = createHandler(() => ({
  apiKey: normalizeKey(process.env.OPENROUTER_API_KEY),
  referer: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:5173',
}));
