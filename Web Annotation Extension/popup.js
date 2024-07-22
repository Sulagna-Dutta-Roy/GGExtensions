document.addEventListener("DOMContentLoaded", function(){
    document.getElementById('enableAnnotation').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            if ((tab.url.startsWith('http://') || tab.url.startsWith('https://')) && (tab && tab.id)) {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['annotation.js']
                }).then(() => {
                    console.log("Annotation script executed.");
                    chrome.tabs.sendMessage(tab.id, {action: "toggleSidebar"});
                }).catch((err) => {
                    console.error("Script execution failed: ", err);
                });
            } else {
                console.error("Cannot run script on this URL.");
                alert("Cannot run script on this URL.");
            }
        });
    });

    document.getElementById('saveScreenshot').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
                chrome.tabs.captureVisibleTab(tabs[0].windowId, {}, function(image) {
                    const link = document.createElement('a');
                    link.href = image;
                    link.download = 'screenshot.png';
                    link.click();
                });
            } else {
                console.error("Cannot capture screenshot on this URL.");
                alert("Cannot capture screenshot on this URL.");
            }
        });
    });
});