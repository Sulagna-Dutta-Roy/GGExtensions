chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('emails', (data) => {
    if (!data.emails) {
      chrome.storage.sync.set({ emails: [] });
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "storeEmail") {
    chrome.storage.sync.get("emails", (data) => {
      const emails = data.emails || [];
      emails.push(request.email);
      chrome.storage.sync.set({ emails: emails }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error storing email:', chrome.runtime.lastError);
          sendResponse({ success: false });
        } else {
          sendResponse({ success: true });
        }
      });
    });
    return true; // Indicates that the response is asynchronous
  }
});