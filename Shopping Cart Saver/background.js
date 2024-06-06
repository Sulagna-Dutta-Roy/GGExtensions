chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ cartItems: [], maxMoney: 0, maxItems: 0 });
  });
  