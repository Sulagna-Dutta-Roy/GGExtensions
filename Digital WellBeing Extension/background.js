let activeTabId = null;
let activeTabUrl = null;
let startTime = null;

function trackTime() {
    if (activeTabUrl && startTime) {
        const endTime = Date.now();
        const timeSpent = endTime - startTime;
        chrome.storage.local.get([activeTabUrl], result => {
            const total = result[activeTabUrl] ? result[activeTabUrl] + timeSpent : timeSpent;
            chrome.storage.local.set({
                [activeTabUrl]: total
            });
        });
    }
}

chrome.tabs.onActivated.addListener(activeInfo => {
    trackTime();
    chrome.tabs.get(activeInfo.tabId, tab => {
        activeTabId = tab.id;
        activeTabUrl = new URL(tab.url).hostname;
        startTime = Date.now();
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabId === activeTabId && changeInfo.url) {
        trackTime();
        activeTabUrl = new URL(tab.url).hostname;
        startTime = Date.now();
    }
});

chrome.tabs.onRemoved.addListener(tabId => {
    if (tabId === activeTabId) {
        trackTime();
        activeTabId = null;
        activeTabUrl = null;
        startTime = null;
    }
});

chrome.windows.onFocusChanged.addListener(windowId => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        trackTime();
    } else {
        chrome.windows.get(windowId, { populate: true }, window => {
            if (window.tabs.length > 0) {
                const activeTab = window.tabs.find(tab => tab.active);
                if (activeTab) {
                    activeTabId = activeTab.id;
                    activeTabUrl = new URL(activeTab.url).hostname;
                    startTime = Date.now();
                }
            }
        });
    }
});