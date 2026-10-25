import { getStreamIdleMinutes } from '../../config/env.js';
import { getSessionByRoom } from '../state/sessionStore.js';
import { createIngressClient } from './clients.js';
import { teardownStreamResources } from './streamSessionService.js';

const POLL_INTERVAL_MS = 60_000;
/** LiveKit IngressState.Status: ENDPOINT_BUFFERING, ENDPOINT_PUBLISHING */
const CONNECTED_STATUSES = new Set([1, 2]);

/** @type {Map<string, number>} */
const firstSeenIdleAt = new Map();

let sweepInFlight = false;
let interval = null;

function liveKitTimeToMs(value) {
  if (value == null) return 0;
  if (typeof value === 'bigint') {
    if (value <= 0n) return 0;
    return Number(value / 1_000_000n);
  }
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  if (n > 1e16) return Math.floor(n / 1e6);
  return Math.floor(n);
}

export function isBotIngress(ingress) {
  return Boolean(
    ingress?.name?.startsWith('obs-') && ingress?.roomName?.startsWith('stream-'),
  );
}

function isConnected(ingress) {
  const status = ingress?.state?.status;
  return CONNECTED_STATUSES.has(status);
}

function idleStartedAt(ingress, session) {
  const endedAt = liveKitTimeToMs(ingress?.state?.endedAt);
  if (endedAt) return endedAt;

  const updatedAt = liveKitTimeToMs(ingress?.state?.updatedAt);
  if (updatedAt) return updatedAt;

  if (session?.createdAt) return session.createdAt;

  const seen = firstSeenIdleAt.get(ingress.ingressId);
  if (seen) return seen;

  const now = Date.now();
  firstSeenIdleAt.set(ingress.ingressId, now);
  return now;
}

async function notifyAutoStop(discordClient, channelId, idleMinutes) {
  if (!discordClient || !channelId) return;

  try {
    const channel = await discordClient.channels.fetch(channelId);
    if (!channel?.isTextBased()) return;
    await channel.send(
      `Stream ended automatically. OBS was disconnected for ${idleMinutes} minutes, so the room and ingress were removed.`,
    );
  } catch (err) {
    console.warn('idle watch channel message:', err.message);
  }
}

export async function sweepIdleIngresses({ discordClient } = {}) {
  const ingressClient = createIngressClient();
  const items = await ingressClient.listIngress();
  const idleMinutes = getStreamIdleMinutes();
  const idleMs = idleMinutes * 60 * 1000;
  const now = Date.now();

  for (const ingress of items) {
    if (!isBotIngress(ingress)) continue;

    if (isConnected(ingress)) {
      firstSeenIdleAt.delete(ingress.ingressId);
      continue;
    }

    const session = getSessionByRoom(ingress.roomName);
    const idleSince = idleStartedAt(ingress, session);
    if (!idleSince || now - idleSince < idleMs) continue;

    console.log(
      `Idle ingress cleanup: ${ingress.ingressId} (${ingress.roomName}) idle for ${idleMinutes}m`,
    );

    const channelId = session?.channelId;
    firstSeenIdleAt.delete(ingress.ingressId);

    try {
      await teardownStreamResources({
        ingressId: ingress.ingressId,
        roomName: ingress.roomName,
        guildId: session?.guildId,
      });
      await notifyAutoStop(discordClient, channelId, idleMinutes);
    } catch (err) {
      console.warn('idle watch teardown:', err.message);
    }
  }
}

async function runSweep(discordClient) {
  if (sweepInFlight) return;
  sweepInFlight = true;
  try {
    await sweepIdleIngresses({ discordClient });
  } catch (err) {
    console.warn('ingress idle watch:', err.message);
  } finally {
    sweepInFlight = false;
  }
}

export function startIngressIdleWatch({ discordClient } = {}) {
  if (interval) return;

  try {
    createIngressClient();
  } catch {
    console.warn('Ingress idle watch disabled — LiveKit API is not configured.');
    return;
  }

  const tick = () => {
    runSweep(discordClient);
  };

  tick();
  interval = setInterval(tick, POLL_INTERVAL_MS);
  interval.unref?.();
  console.log(
    `Ingress idle watch started (every 60s, ${getStreamIdleMinutes()}m without OBS)`,
  );
}
