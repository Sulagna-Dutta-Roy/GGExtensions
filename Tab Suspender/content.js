document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column;">
        <h1>Tab Suspended</h1>
        <p>This tab has been suspended to save memory. Click the button below to reload it.</p>
        <button id="reload-tab">Reload Tab</button>
    </div>
`;
document.getElementById('reload-tab').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'unsuspendTab', tabId: chrome.tabs.Tab.id });
});
