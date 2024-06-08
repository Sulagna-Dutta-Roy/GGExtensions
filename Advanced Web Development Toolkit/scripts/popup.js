document.getElementById('debugger').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.debugger.attach({ tabId: tabs[0].id }, '1.3', () => {
            chrome.debugger.sendCommand({ tabId: tabs[0].id }, 'Debugger.enable');
            console.log('Debugger started');
        });
    });
});

document.getElementById('collab').addEventListener('click', () => {
    chrome.tabs.create({ url: '../webrtc.html' });
});

document.getElementById('snippets').addEventListener('click', () => {
    chrome.tabs.create({ url: '../snippets.html' });
});