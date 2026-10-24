import express from 'express';
import { getSessionByRoom } from '../../bot/state/sessionStore.js';
import { mintViewerToken } from '../../bot/livekit/viewerToken.js';

export function createViewerTokenRouter() {
  const router = express.Router();

  router.get('/api/viewer-token', async (req, res) => {
    const roomName = req.query.room;
    if (!roomName || typeof roomName !== 'string') {
      res.status(400).json({ error: 'Missing room query parameter.' });
      return;
    }

    const session = getSessionByRoom(roomName);
    if (!session) {
      res.status(404).json({ error: 'No active stream for this room.' });
      return;
    }

    try {
      const token = await mintViewerToken(roomName);
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Could not mint viewer token.' });
    }
  });

  return router;
}
