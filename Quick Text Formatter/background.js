chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'getSelection') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { selection: window.getSelection().toString() });
        });
    }
});