export function createStreamControls({ joinButton, leaveButton }) {
  return {
    setJoinEnabled(enabled) {
      joinButton.disabled = !enabled;
    },
    setLeaveEnabled(enabled) {
      leaveButton.disabled = !enabled;
    },
    setConnecting() {
      joinButton.disabled = true;
      leaveButton.disabled = true;
    },
    setIdle() {
      joinButton.disabled = false;
      leaveButton.disabled = true;
    },
    setWatching() {
      joinButton.disabled = true;
      leaveButton.disabled = false;
    },
  };
}
