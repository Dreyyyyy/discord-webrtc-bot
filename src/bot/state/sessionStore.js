/** @typedef {{ roomName: string, ingressId: string, guildId: string, channelId: string }} StreamSession */

const byGuildId = new Map();
const byRoomName = new Map();

export function getSessionByGuild(guildId) {
  return byGuildId.get(guildId) ?? null;
}

export function getSessionByRoom(roomName) {
  return byRoomName.get(roomName) ?? null;
}

export function setSession(session) {
  byGuildId.set(session.guildId, session);
  byRoomName.set(session.roomName, session);
}

export function clearSession(guildId) {
  const existing = byGuildId.get(guildId);
  if (!existing) return null;
  byGuildId.delete(guildId);
  byRoomName.delete(existing.roomName);
  return existing;
}
