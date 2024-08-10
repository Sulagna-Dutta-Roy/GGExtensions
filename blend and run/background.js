chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "blendAndRun",
        title: "Blend and Run",
        contexts: ["selection", "page"]
    });

    chrome.contextMenus.create({
        id: "copyText",
        title: "Copy Selected Text",
        parentId: "blendAndRun",
        contexts: ["selection"]
    });

    chrome.contextMenus.create({
        id: "runScript",
        title: "Run Custom Script",
        parentId: "blendAndRun",
        contexts: ["page"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "copyText" && info.selectionText) {
        copyToClipboard(info.selectionText);
    } else if (info.menuItemId === "runScript") {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ['customScript.js']
        });
    }
});

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Text copied to clipboard!');
    }, (err) => {
        console.error('Failed to copy text: ', err);
    });
}
