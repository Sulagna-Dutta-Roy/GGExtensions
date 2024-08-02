let color = 'red';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ color });
});
