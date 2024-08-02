chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'bookmarkPage') {
        chrome.storage.local.get(['bookmarks'], (result) => {
            const bookmarks = result.bookmarks || [];
            bookmarks.push({ title: document.title, url: window.location.href });
            chrome.storage.local.set({ bookmarks });
        });
    }
});