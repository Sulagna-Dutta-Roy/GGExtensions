// Background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'getComments') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, 'getComments', (response) => {
        sendResponse(response);
      });
    });
    return true; // Keeps the message channel open for sendResponse
  }
});
