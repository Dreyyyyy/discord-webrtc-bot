export function createStatusView(element) {
  return {
    set(message, tone = 'default') {
      element.textContent = message;
      element.classList.remove('is-live', 'is-error');
      if (tone === 'live') element.classList.add('is-live');
      if (tone === 'error') element.classList.add('is-error');
    },
  };
}
