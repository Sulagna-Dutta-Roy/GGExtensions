// content.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action === "getPageContent") {
        sendResponse({content: document.body.innerText});
      } else if (request.action === "ping") {
        sendResponse({status: "ok"});
      }
    }
  );