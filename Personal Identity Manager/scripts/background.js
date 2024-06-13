chrome.runtime.onInstalled.addListener(() => {
    console.log('Digital Identity Manager Installed');
    chrome.storage.sync.set({ identities: [] });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'getIdentities') {
        chrome.storage.sync.get(['identities'], (result) => {
            sendResponse(result.identities);
        });
        return true;
    }
    if (message.type === 'saveIdentity') {
        chrome.storage.sync.get(['identities'], (result) => {
            const identities = result.identities;
            identities.push(message.identity);
            chrome.storage.sync.set({ identities }, () => {
                sendResponse({ status: 'success' });
            });
        });
        return true;
    }
});