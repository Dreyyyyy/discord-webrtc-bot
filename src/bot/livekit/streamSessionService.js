import { IngressInput } from 'livekit-server-sdk';
import { getMaxViewers } from '../../config/env.js';
import { createIngressClient, createRoomServiceClient } from './clients.js';
import {
  clearSession,
  getSessionByGuild,
  getSessionByRoom,
  setSession,
} from '../state/sessionStore.js';

export function roomNameForGuild(guildId) {
  return `stream-${guildId}`;
}

export async function startStreamSession({ guildId, channelId }) {
  if (getSessionByGuild(guildId)) {
    throw new Error('A stream is already active in this server. Use `/stream stop` first.');
  }

  const roomName = roomNameForGuild(guildId);
  const roomClient = createRoomServiceClient();
  const ingressClient = createIngressClient();

  try {
    await roomClient.createRoom({
      name: roomName,
      maxParticipants: getMaxViewers() + 1,
      emptyTimeout: 60 * 30,
    });
  } catch (err) {
    if (!String(err.message).includes('already exists')) {
      throw err;
    }
  }

  const ingress = await ingressClient.createIngress(IngressInput.RTMP_INPUT, {
    name: `obs-${guildId}`,
    roomName,
    participantIdentity: 'obs',
    participantName: 'OBS',
    enableTranscoding: true,
  });

  const session = {
    guildId,
    channelId,
    roomName,
    ingressId: ingress.ingressId,
    createdAt: Date.now(),
  };

  setSession(session);

  return {
    session,
    rtmpUrl: ingress.url,
    streamKey: ingress.streamKey,
  };
}

export async function deleteLiveKitResources({ ingressId, roomName }) {
  const ingressClient = createIngressClient();
  const roomClient = createRoomServiceClient();

  if (ingressId) {
    try {
      await ingressClient.deleteIngress(ingressId);
    } catch (err) {
      console.warn('deleteIngress:', err.message);
    }
  }

  if (roomName) {
    try {
      await roomClient.deleteRoom(roomName);
    } catch (err) {
      console.warn('deleteRoom:', err.message);
    }
  }
}

export async function teardownStreamResources({ ingressId, roomName, guildId }) {
  const session =
    (guildId && getSessionByGuild(guildId)) ||
    (roomName && getSessionByRoom(roomName)) ||
    null;

  if (session) {
    clearSession(session.guildId);
  }

  await deleteLiveKitResources({
    ingressId: ingressId ?? session?.ingressId,
    roomName: roomName ?? session?.roomName,
  });

  return session;
}

export async function stopStreamSession(guildId) {
  const session = getSessionByGuild(guildId);
  if (!session) {
    throw new Error('No active stream in this server.');
  }

  await teardownStreamResources(session);
  return session;
}
