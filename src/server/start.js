import { loadEnv, getPort } from '../config/env.js';
import { createApp } from '../http/createApp.js';
import { startBot } from '../bot/startBot.js';

export async function startServer() {
  loadEnv();

  const app = createApp();
  const port = getPort();

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  await startBot();

  return app;
}
