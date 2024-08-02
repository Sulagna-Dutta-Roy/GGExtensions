chrome.runtime.onInstalled.addListener(() => {
    console.log('Contextual Content Enhancer Installed');
    // Set default settings
    chrome.storage.sync.set({
        settings: {
            textToSpeech: true,
            translation: true,
            summarization: true,
            keywordHighlighting: true,
            language: 'en',
            keywords: []
        }
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'getSettings') {
        chrome.storage.sync.get(['settings'], (result) => {
            sendResponse(result.settings);
        });
        return true;
    }
});