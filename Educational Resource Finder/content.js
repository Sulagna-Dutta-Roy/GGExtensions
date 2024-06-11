// Extract the main content of the page for analysis
function getPageContent() {
  const bodyText = document.body.innerText;
  return bodyText;
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageContent") {
    const content = getPageContent();
    sendResponse({ content });
  }
});
