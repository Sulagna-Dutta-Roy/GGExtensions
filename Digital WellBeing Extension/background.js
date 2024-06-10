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
                [activeTabUrl]: total }, () => {
                console.log(`Updated time for ${activeTabUrl}: ${total} ms`);
            });
        });
    }
}

function resetTracking() {
    activeTabId = null;
    activeTabUrl = null;
    startTime = null;
}

function startTracking(tab) {
    if (tab.url && tab.url.startsWith('http')) { // Ensure it's a valid URL
        activeTabId = tab.id;
        activeTabUrl = new URL(tab.url).hostname;
        startTime = Date.now();
    }
}

chrome.tabs.onActivated.addListener(activeInfo => {
    trackTime();
    chrome.tabs.get(activeInfo.tabId, tab => {
        startTracking(tab);
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabId === activeTabId && changeInfo.url) {
        trackTime();
        startTracking(tab);
    }
});

chrome.tabs.onRemoved.addListener(tabId => {
    if (tabId === activeTabId) {
        trackTime();
        resetTracking();
    }
});

chrome.windows.onFocusChanged.addListener(windowId => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        trackTime();
        resetTracking();
    } else {
        chrome.windows.get(windowId, { populate: true }, window => {
            if (window.tabs.length > 0) {
                const activeTab = window.tabs.find(tab => tab.active);
                if (activeTab) {
                    startTracking(activeTab);
                }
            }
        });
    }
});

// Periodic check to update time
setInterval(() => {
    trackTime();
    if (activeTabId && activeTabUrl && startTime) {
        startTime = Date.now(); // Reset start time
    }
}, 10000); // Every 10 seconds to reduce time update delay