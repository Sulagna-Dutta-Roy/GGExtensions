document.getElementById('setSpeedButton').addEventListener('click', () => {
    const speed = parseFloat(document.getElementById('speedInput').value);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: setPlaybackSpeed,
            args: [speed]
        });
    });
});

function setPlaybackSpeed(speed) {
    const video = document.querySelector('video');
    if (video) {
        video.playbackRate = speed;
    }
}
