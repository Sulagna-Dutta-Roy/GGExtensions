function speak(text) {
    chrome.tts.speak(text, {
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0
    }, function () {
        if (chrome.runtime.lastError) {
            console.error("Error: " + chrome.runtime.lastError.message);
        }
    });
}