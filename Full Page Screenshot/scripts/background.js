chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.captureVisibleTab(null, { format: 'png', quality: 100 }, function(dataUrl) {
        var link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'full-page-screenshot.png';
        link.click();
    });
});
