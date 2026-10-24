export async function fetchLiveKitUrl() {
  const res = await fetch('/config');
  if (!res.ok) {
    throw new Error('Failed to load LiveKit config');
  }

  const data = await res.json();
  if (!data.url) {
    throw new Error('LIVEKIT_URL is not configured on the server');
  }

  return data.url;
}
