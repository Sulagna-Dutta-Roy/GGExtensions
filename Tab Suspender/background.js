const DEFAULT_SUSPENSION_TIME = 10; 
let suspensionTime = DEFAULT_SUSPENSION_TIME;
let exclusions = [];

chrome.storage.sync.get(['suspensionTime', 'exclusions'], (data) => {
    if (data.suspensionTime) suspensionTime = data.suspensionTime;
    if (data.exclusions) exclusions = data.exclusions;
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.suspensionTime) suspensionTime = changes.suspensionTime.newValue;
    if (changes.exclusions) exclusions = changes.exclusions.newValue;
});

function suspendTab(tabId) {
    chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js']
    });
}

function unsuspendTab(tabId) {
    chrome.tabs.reload(tabId);
}

function checkTabs() {
    chrome.tabs.query({}, (tabs) => {
        const currentTime = new Date().getTime();
        tabs.forEach((tab) => {
            if (exclusions.some(url => tab.url.includes(url))) return;
            const lastAccessed = tab.lastAccessed || currentTime;
            const inactiveTime = (currentTime - lastAccessed) / 1000 / 60; 
            if (inactiveTime >= suspensionTime) {
                suspendTab(tab.id);
            }
        });
    });
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'suspendAll') {
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => suspendTab(tab.id));
        });
    } else if (message.action === 'unsuspendAll') {
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => unsuspendTab(tab.id));
        });
    }
});

setInterval(checkTabs, 60000); 
