chrome.runtime.onInstalled.addListener(() => {
    console.log('Web Dev Toolkit Installed');
});

chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: '../popup.html' });
});