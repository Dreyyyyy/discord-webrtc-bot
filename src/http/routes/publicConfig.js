import express from 'express';
import { getLiveKitUrl } from '../../config/env.js';

export function createPublicConfigRouter() {
  const router = express.Router();

  router.get('/config', (_req, res) => {
    res.json({ url: getLiveKitUrl() });
  });

  return router;
}
