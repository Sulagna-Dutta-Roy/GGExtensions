document.addEventListener('DOMContentLoaded', function() {
    const volumeSlider = document.getElementById('volume');
    const valueDisplay = document.getElementById('value');

    volumeSlider.addEventListener('input', function() {
        const volume = volumeSlider.value;
        valueDisplay.textContent = `${volume}%`;

        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { volume: volume });
        });
    });
});