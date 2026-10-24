import { loadEnv, getPort } from '../config/env.js';
import { createApp } from '../http/createApp.js';

export function startServer() {
  loadEnv();

  const app = createApp();
  const port = getPort();

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  return app;
}
