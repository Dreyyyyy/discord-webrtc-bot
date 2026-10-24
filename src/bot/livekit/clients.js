import {
  IngressClient,
  RoomServiceClient,
} from 'livekit-server-sdk';
import {
  getLiveKitApiKey,
  getLiveKitApiSecret,
  getLiveKitHttpHost,
} from '../../config/env.js';

function requireLiveKitConfig() {
  const host = getLiveKitHttpHost();
  const apiKey = getLiveKitApiKey();
  const apiSecret = getLiveKitApiSecret();
  if (!host || !apiKey || !apiSecret) {
    throw new Error('LiveKit API is not configured (URL, API key, secret).');
  }
  return { host, apiKey, apiSecret };
}

export function createIngressClient() {
  const { host, apiKey, apiSecret } = requireLiveKitConfig();
  return new IngressClient(host, apiKey, apiSecret);
}

export function createRoomServiceClient() {
  const { host, apiKey, apiSecret } = requireLiveKitConfig();
  return new RoomServiceClient(host, apiKey, apiSecret);
}
