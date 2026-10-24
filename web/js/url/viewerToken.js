export function getViewerTokenFromLocation() {
  const params = new URLSearchParams(location.hash.slice(1));
  return params.get('token');
}
