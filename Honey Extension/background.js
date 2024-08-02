chrome.runtime.onInstalled.addListener(() => {
  console.log("Enhanced Honey Extension Installed");
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.tabs.sendMessage(tabId, {type: "CHECK_FOR_COUPONS"});
  }
});

// Listen for price drop notifications
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "PRICE_DROP") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "images/icon48.png",
      title: "Price Drop Alert!",
      message: `Price dropped for ${request.productName}. New price: ${request.newPrice}`,
    });
  }
});
