chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed");
    analyzeHistoryAndStoreInterests();
  });
  
  chrome.history.onVisited.addListener(() => {
    analyzeHistoryAndStoreInterests();
  });
  
  function analyzeHistoryAndStoreInterests() {
    chrome.history.search({ text: '', maxResults: 100 }, (historyItems) => {
      let topics = analyzeHistory(historyItems);
      chrome.storage.local.set({ interests: topics });
    });
  }
  
  function analyzeHistory(historyItems) {
    let topics = {};
    historyItems.forEach((item) => {
      let url = new URL(item.url);
      let hostname = url.hostname;
      if (!topics[hostname]) {
        topics[hostname] = 0;
      }
      topics[hostname]++;
    });
    return topics;
  }
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getRecommendations") {
      chrome.storage.local.get(['interests'], (result) => {
        let recommendations = generateRecommendations(result.interests);
        sendResponse(recommendations);
      });
      return true; // Keep the message channel open for sendResponse
    }
  });
  
  function generateRecommendations(interests) {
    let recommendations = [];
    for (let topic in interests) {
      recommendations.push({
        title: `Learn more about ${topic}`,
        url: `https://example.com/search?q=${topic}`
      });
    }
    return recommendations;
  }
  