export function attachRemoteTrack(track, mediaElement) {
  if (track.kind === 'video' || track.kind === 'audio') {
    track.attach(mediaElement);
  }
}

export function syncExistingRemoteTracks(room, mediaElement) {
  for (const participant of room.remoteParticipants.values()) {
    for (const publication of participant.trackPublications.values()) {
      if (publication.track) {
        attachRemoteTrack(publication.track, mediaElement);
      }
    }
  }
}
