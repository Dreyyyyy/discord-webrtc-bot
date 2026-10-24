import { getPublicWatchUrl } from '../../config/env.js';

export function buildWatchLink(roomName) {
  const base = getPublicWatchUrl();
  if (!base) {
    throw new Error('PUBLIC_WATCH_URL is not configured.');
  }
  const params = new URLSearchParams({ room: roomName });
  return `${base}#${params.toString()}`;
}
