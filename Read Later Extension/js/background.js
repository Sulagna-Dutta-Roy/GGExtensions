chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ articles: [], tags: [] });
});

// Additional background functionalities can be added here, such as offline reading options
