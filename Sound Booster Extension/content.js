let audioContext = null;
let gainNode = null;

function setupAudioBoost() {
    const videos = document.getElementsByTagName('video');
    for (let video of videos) {
        if (!audioContext) {
            audioContext = new AudioContext();
            const source = audioContext.createMediaElementSource(video);
            gainNode = audioContext.createGain();
            source.connect(gainNode);
            gainNode.connect(audioContext.destination);
        }
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    setupAudioBoost();
    if (gainNode) {
        gainNode.gain.value = request.volume / 100;
    }
});