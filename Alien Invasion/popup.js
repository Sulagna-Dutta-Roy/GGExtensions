document.getElementById('start-game').addEventListener('click', function() {
    chrome.tabs.create({ url: chrome.runtime.getURL('game/index.html') });
});
