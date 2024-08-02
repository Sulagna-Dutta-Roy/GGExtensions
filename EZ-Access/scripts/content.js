chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'insertProfileLink') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === 'INPUT' && activeElement.type === 'text') {
            activeElement.value = request.link;
        }
    }
});