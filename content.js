function detectSystemTheme() {
  const theme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'ms.vss-web.vsts-theme-dark'
    : 'ms.vss-web.vsts-theme';
  chrome.storage.sync.set({ theme });
}

// Initial theme detection
detectSystemTheme();

// Listen for changes in the system theme
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', detectSystemTheme);
