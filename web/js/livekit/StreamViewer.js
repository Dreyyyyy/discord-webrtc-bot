import { LIVEKIT_CLIENT_ESM } from '../constants.js';
import {
  attachRemoteTrack,
  syncExistingRemoteTracks,
} from '../media/attachRemoteTrack.js';

let livekitModulePromise;

async function loadLiveKitClient() {
  if (!livekitModulePromise) {
    livekitModulePromise = import(LIVEKIT_CLIENT_ESM);
  }
  return livekitModulePromise;
}

/**
 * Manages a subscribe-only LiveKit room session for the watch page.
 */
export async function createStreamViewer({
  videoElement,
  onStatus,
  onDisconnected,
}) {
  const { Room, RoomEvent } = await loadLiveKitClient();

  let room = null;

  const notify = (message, tone = 'default') => onStatus?.(message, tone);

  function bindRoomEvents(activeRoom) {
    activeRoom.on(RoomEvent.TrackSubscribed, (track) => {
      attachRemoteTrack(track, videoElement);
      notify('Live', 'live');
    });

    activeRoom.on(RoomEvent.TrackUnsubscribed, (track) => {
      track.detach();
    });

    activeRoom.on(RoomEvent.Disconnected, () => {
      room = null;
      notify('Disconnected');
      onDisconnected?.();
    });
  }

  async function connect(livekitUrl, token) {
    if (room) {
      return;
    }

    room = new Room({
      adaptiveStream: true,
      dynacast: true,
    });

    bindRoomEvents(room);

    await room.connect(livekitUrl, token);
    syncExistingRemoteTracks(room, videoElement);

    if (room.remoteParticipants.size === 0) {
      notify('Connected — waiting for stream…');
    } else {
      notify('Connected');
    }
  }

  async function disconnect() {
    if (!room) return;
    await room.disconnect();
    room = null;
  }

  function isConnected() {
    return room != null;
  }

  return {
    connect,
    disconnect,
    isConnected,
  };
}
