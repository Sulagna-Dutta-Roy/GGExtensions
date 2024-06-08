chrome.runtime.sendMessage({ type: 'getSettings' }, (settings) => {
    if (settings.textToSpeech) {
        // Inject text-to-speech functionality
        injectTextToSpeech();
    }
    if (settings.translation) {
        // Inject translation functionality
        injectTranslation(settings.language);
    }
    if (settings.summarization) {
        // Inject summarization functionality
        injectSummarization();
    }
    if (settings.keywordHighlighting) {
        // Inject keyword highlighting functionality
        injectKeywordHighlighting(settings.keywords);
    }
});

function injectTextToSpeech() {
    document.body.addEventListener('dblclick', (event) => {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            chrome.tts.speak(selectedText);
        }
    });
}

function injectTranslation(targetLanguage) {
    // Implement translation using a translation API (e.g., Google Translate API)
    // This is a placeholder function
    document.body.addEventListener('dblclick', (event) => {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            // Translate selectedText to targetLanguage and display it
        }
    });
}

function injectSummarization() {
    // Implement summarization using a summarization API (e.g., OpenAI GPT)
    // This is a placeholder function
    const summaryButton = document.createElement('button');
    summaryButton.textContent = 'Summarize Page';
    document.body.appendChild(summaryButton);
    summaryButton.addEventListener('click', () => {
        const content = document.body.innerText;
        // Send content to summarization API and display the summary
    });
}

function injectKeywordHighlighting(keywords) {
    const content = document.body.innerHTML;
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        document.body.innerHTML = content.replace(regex, `<mark>${keyword}</mark>`);
    });
}