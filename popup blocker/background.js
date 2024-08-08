let blocking = true;

chrome.storage.local.get(['blocking'], function(result) {
  blocking = result.blocking !== undefined ? result.blocking : true;
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (blocking) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Popup Blocker',
        message: 'Popup blocked!'
      });
    }
    return { cancel: blocking };
  },
  { urls: ["*://*/*"], types: ["popup"] },
  ["blocking"]
);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "toggleBlocking") {
    blocking = request.blocking;
    chrome.storage.local.set({ blocking: blocking });
    sendResponse({ blocking: blocking });
  } else if (request.action === "getBlockingStatus") {
    sendResponse({ blocking: blocking });
  }
});