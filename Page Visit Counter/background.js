let visitCounts = {};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const url = new URL(tab.url).hostname;

    chrome.storage.local.get([url], (result) => {
      const count = result[url] || 0;
      visitCounts[url] = count + 1;

      let update = {};
      update[url] = visitCounts[url];
      chrome.storage.local.set(update);
    });
  }
});
