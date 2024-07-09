// background.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "summarize") {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "getPageContent"}, function(response) {
          if (chrome.runtime.lastError) {
            // If there's an error (like the page not allowing content script injection)
            chrome.tabs.executeScript(
              tabs[0].id,
              { code: 'document.body.innerText' },
              function(result) {
                const summary = summarizeText(result[0]);
                sendResponse({summary: summary});
              }
            );
          } else {
            const summary = summarizeText(response.content);
            sendResponse({summary: summary});
          }
        });
      });
      return true;  // Indicates that the response is asynchronous
    }
  }
);

function summarizeText(text) {
  // Simple summarization: first 3 sentences
  const sentences = text.split(/[.!?]+/);
  return sentences.slice(0, 3).join('. ') + '.';
}

// Inject content script if not already present
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    chrome.tabs.sendMessage(tabId, {action: "ping"}, function(response) {
      if (chrome.runtime.lastError) {
        chrome.tabs.executeScript(tabId, {file: "content.js"});
      }
    });
  }
});