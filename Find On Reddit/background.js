// This script is optional and can be used for background tasks if needed

// Example: Listen for extension installation
chrome.runtime.onInstalled.addListener(function() {
  console.log("Extension installed.");
});

// Example: Listen for messages from content scripts or other parts of the extension
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "fetchRedditThreads") {
    // You can perform background tasks here, if needed
    // For example, you might want to make API requests to Reddit in the background
    // Once you have the data, you can send a response back to the content script
    sendResponse({ status: "success", data: "Reddit threads fetched successfully." });
  }
});
