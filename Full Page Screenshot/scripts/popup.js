document.getElementById('capture').addEventListener('click', function() {
    chrome.runtime.sendMessage({ action: 'captureScreenshot' });
});
