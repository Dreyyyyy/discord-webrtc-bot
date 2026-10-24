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

export function getPublicWatchUrl() {
  return process.env.PUBLIC_WATCH_URL ?? '';
}
