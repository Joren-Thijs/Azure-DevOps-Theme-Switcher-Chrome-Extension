// Listen for theme changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.theme) {
    const newTheme = changes.theme.newValue;
    chrome.tabs.query({ url: 'https://dev.azure.com/*' }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: updateTheme,
          args: [newTheme],
        });
      });
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'reloadTab') {
    // Reload the current tab
    chrome.tabs.reload(sender.tab.id);
  }
});

function updateTheme(theme) {
  const orgId = window.location.href.split('/')[3];

  const payload = {
    'WebPlatform/Theme': theme,
  };

  fetch(`https://dev.azure.com/${orgId}/_apis/Settings/Entries/globalme`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept:
        'application/json;api-version=4.1-preview.1;excludeUrls=true;enumsAsNumbers=true;msDateFormat=true;noArrayWrap=true',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'en-US,en;q=0.9,nl;q=0.8,fr-BE;q=0.7,fr;q=0.6',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (response.ok) {
        chrome.runtime.sendMessage({ action: 'reloadTab' });
      } else {
        console.error('Failed to update theme', response.statusText);
      }
    })
    .catch((error) => console.error('Error:', error));
}
