import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createPublicConfigRouter } from './routes/publicConfig.js';
import { createViewerTokenRouter } from './routes/viewerToken.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '../../web');

export function createApp() {
  const app = express();

  app.use(createPublicConfigRouter());
  app.use(createViewerTokenRouter());
  app.use(express.static(webRoot));

  return app;
}
