import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

let loaded = false;

export function loadEnv() {
  if (loaded) return;
  dotenv.config({ path: path.join(projectRoot, '.env') });
  loaded = true;
}

export function getPort() {
  return Number(process.env.PORT) || 3000;
}

export function getLiveKitUrl() {
  return process.env.LIVEKIT_URL ?? '';
}

export function getLiveKitHttpHost() {
  const url = getLiveKitUrl();
  if (!url) return '';
  return url.replace(/^wss:/, 'https:').replace(/^ws:/, 'http:');
}

export function getLiveKitApiKey() {
  return process.env.LIVEKIT_API_KEY ?? '';
}

export function getLiveKitApiSecret() {
  return process.env.LIVEKIT_API_SECRET ?? '';
}

export function getPublicWatchUrl() {
  const base = process.env.PUBLIC_WATCH_URL ?? '';
  return base.replace(/\/$/, '');
}

export function getMaxViewers() {
  const n = Number(process.env.MAX_VIEWERS);
  return Number.isFinite(n) && n > 0 ? n : 8;
}

export function getDiscordToken() {
  return process.env.DISCORD_TOKEN ?? '';
}

export function getDiscordAppId() {
  return process.env.DISCORD_APP_ID ?? process.env.DISCORD_CLIENT_ID ?? '';
}

/** Optional: register slash commands to one guild for faster dev iteration */
export function getDiscordGuildId() {
  return process.env.DISCORD_GUILD_ID ?? '';
}

/** Minutes without an OBS publish before ingress and room are removed. */
export function getStreamIdleMinutes() {
  const n = Number(process.env.STREAM_IDLE_MINUTES);
  return Number.isFinite(n) && n > 0 ? n : 30;
}
