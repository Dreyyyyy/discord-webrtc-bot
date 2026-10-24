import { AccessToken } from 'livekit-server-sdk';
import { randomUUID } from 'crypto';
import {
  getLiveKitApiKey,
  getLiveKitApiSecret,
} from '../../config/env.js';

const VIEWER_TOKEN_TTL = '4h';

export async function mintViewerToken(roomName) {
  const apiKey = getLiveKitApiKey();
  const apiSecret = getLiveKitApiSecret();

  const token = new AccessToken(apiKey, apiSecret, {
    identity: `viewer-${randomUUID()}`,
    ttl: VIEWER_TOKEN_TTL,
  });

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: false,
    canSubscribe: true,
  });

  return token.toJwt();
}
