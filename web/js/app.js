import { fetchLiveKitUrl } from './api/publicConfig.js';
import { fetchViewerToken } from './api/viewerToken.js';
import {
  getRoomFromLocation,
  getViewerTokenFromLocation,
} from './url/viewerToken.js';
import { createStatusView } from './ui/statusView.js';
import { createStreamControls } from './ui/streamControls.js';
import { createStreamViewer } from './livekit/StreamViewer.js';

const status = createStatusView(document.getElementById('status'));
const controls = createStreamControls({
  joinButton: document.getElementById('join-button'),
  leaveButton: document.getElementById('leave-button'),
});
const videoElement = document.getElementById('video');

let livekitUrl = null;
let viewer = null;
let roomName = null;

async function ensureViewer() {
  if (!viewer) {
    viewer = await createStreamViewer({
      videoElement,
      onStatus: (message, tone) => status.set(message, tone),
      onDisconnected: () => controls.setIdle(),
    });
  }
  return viewer;
}

async function resolveViewerToken() {
  const tokenFromHash = getViewerTokenFromLocation();
  if (tokenFromHash) {
    return tokenFromHash;
  }
  if (roomName) {
    return fetchViewerToken(roomName);
  }
  return null;
}

async function handleJoin() {
  if (!livekitUrl) {
    status.set('Server config not loaded.', 'error');
    return;
  }

  controls.setConnecting();
  status.set('Connecting…');

  try {
    const token = await resolveViewerToken();
    if (!token) {
      status.set('Missing #room= or #token= in the link.', 'error');
      controls.setIdle();
      return;
    }

    const session = await ensureViewer();
    await session.connect(livekitUrl, token);
    controls.setWatching();
  } catch (err) {
    console.error(err);
    status.set(err.message || 'Could not connect', 'error');
    controls.setIdle();
  }
}

async function handleLeave() {
  if (viewer) {
    await viewer.disconnect();
  }
  controls.setIdle();
}

async function bootstrap() {
  controls.setLeaveEnabled(false);

  roomName = getRoomFromLocation();
  const tokenFromHash = getViewerTokenFromLocation();

  if (!roomName && !tokenFromHash) {
    status.set(
      'Open the watch link from Discord (#room=…) or a manual #token= link.',
      'error',
    );
    controls.setJoinEnabled(false);
    return;
  }

  try {
    livekitUrl = await fetchLiveKitUrl();
    status.set('Ready — click Join.');
    controls.setJoinEnabled(true);
  } catch (err) {
    console.error(err);
    status.set(err.message || 'Setup failed', 'error');
    controls.setJoinEnabled(false);
  }
}

document.getElementById('join-button').addEventListener('click', handleJoin);
document.getElementById('leave-button').addEventListener('click', handleLeave);

bootstrap();
