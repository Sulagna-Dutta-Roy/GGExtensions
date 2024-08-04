function extractContent() {
    let content = document.body.innerText;
    return content;
  }
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getContent") {
      sendResponse({ content: extractContent() });
    }
  });
  