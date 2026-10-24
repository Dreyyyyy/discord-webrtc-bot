import { IngressInput } from 'livekit-server-sdk';
import { getMaxViewers } from '../../config/env.js';
import { createIngressClient, createRoomServiceClient } from './clients.js';
import {
  clearSession,
  getSessionByGuild,
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
  };

  setSession(session);

  return {
    session,
    rtmpUrl: ingress.url,
    streamKey: ingress.streamKey,
  };
}

export async function stopStreamSession(guildId) {
  const session = clearSession(guildId);
  if (!session) {
    throw new Error('No active stream in this server.');
  }

  const ingressClient = createIngressClient();
  const roomClient = createRoomServiceClient();

  try {
    await ingressClient.deleteIngress(session.ingressId);
  } catch (err) {
    console.warn('deleteIngress:', err.message);
  }

  try {
    await roomClient.deleteRoom(session.roomName);
  } catch (err) {
    console.warn('deleteRoom:', err.message);
  }

  return session;
}
