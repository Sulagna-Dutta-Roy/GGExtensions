document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['settings'], (result) => {
        document.getElementById('textToSpeech').checked = result.settings.textToSpeech;
        document.getElementById('translation').checked = result.settings.translation;
        document.getElementById('summarization').checked = result.settings.summarization;
        document.getElementById('keywordHighlighting').checked = result.settings.keywordHighlighting;
        document.getElementById('language').value = result.settings.language;
        document.getElementById('keywords').value = result.settings.keywords.join(', ');
    });

    document.getElementById('saveSettings').addEventListener('click', () => {
        const settings = {
            textToSpeech: document.getElementById('textToSpeech').checked,
            translation: document.getElementById('translation').checked,
            summarization: document.getElementById('summarization').checked,
            keywordHighlighting: document.getElementById('keywordHighlighting').checked,
            language: document.getElementById('language').value,
            keywords: document.getElementById('keywords').value.split(',').map(kw => kw.trim())
        };
        chrome.storage.sync.set({ settings }, () => {
            alert('Settings saved');
        });
    });
});