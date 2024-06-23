chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'captureScreenshot') {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
                sendResponse({ screenshotUrl: dataUrl });
            });
        });
        return true;  // Required to use sendResponse asynchronously.
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "startAnnotation",
        title: "Start Annotation",
        contexts: ["all"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "startAnnotation") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['annotation.js']
        }, () => {
            chrome.tabs.sendMessage(tab.id, { action: "toggleSidebar" });
        });
    }
});
