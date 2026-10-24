export async function fetchViewerToken(roomName) {
  const params = new URLSearchParams({ room: roomName });
  const res = await fetch(`/api/viewer-token?${params}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Could not get viewer token');
  }
  const data = await res.json();
  if (!data.token) {
    throw new Error('Invalid token response from server');
  }
  return data.token;
}
