chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ flashcards: [], notes: [], bookmarks: [], progress: [] });
});

chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: '../popup.html' });
});