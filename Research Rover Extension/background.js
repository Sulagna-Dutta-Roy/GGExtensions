chrome.runtime.onInstalled.addListener(() => {
    console.log("ResearchRover installed and ready to assist!");
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "summarize") {
      // Example summarization logic (replace with actual API or algorithm)
      let summary = message.content.split(' ').slice(0, 50).join(' ') + '...'; // Simple truncation for demo purposes
      sendResponse({ summary: summary });
    }
    return true;
  });
  