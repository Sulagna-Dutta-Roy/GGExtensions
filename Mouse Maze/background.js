let bestTime = Infinity;

chrome.runtime.onInstalled.addListener(() => {
  console.log('Mouse_Maze extension installed');
  // Initialize best time from storage if available
  chrome.storage.local.get(['bestTime'], (result) => {
    if (result.bestTime) {
      bestTime = result.bestTime;
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openGame') {
    chrome.browserAction.openPopup();
  } else if (request.action === 'gameCompleted') {
    console.log('Game completed! Time:', request.time);
    if (request.time < bestTime) {
      bestTime = request.time;
      // Save best time to storage
      chrome.storage.local.set({bestTime: bestTime});
      // Update score display in content script
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'updateScore', score: bestTime});
      });
    }
  }
});