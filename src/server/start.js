import { loadEnv, getPort, getPublicWatchUrl } from '../config/env.js';
import { createApp } from '../http/createApp.js';
import { startBot } from '../bot/startBot.js';

export async function startServer() {
  loadEnv();

  const app = createApp();
  const port = getPort();

  app.listen(port, '0.0.0.0', () => {
    const publicUrl = getPublicWatchUrl();
    console.log(`HTTP listening on port ${port}`);
    if (publicUrl) {
      console.log(`PUBLIC_WATCH_URL=${publicUrl}`);
    } else {
      console.warn('PUBLIC_WATCH_URL is not set — /stream start will fail until you set it.');
    }
  });

  await startBot();

  return app;
}
