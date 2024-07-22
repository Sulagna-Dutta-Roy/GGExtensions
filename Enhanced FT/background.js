chrome.runtime.onInstalled.addListener(() => {
  console.log('Enhanced FT extension installed');
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});
