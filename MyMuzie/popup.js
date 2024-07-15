document.addEventListener('DOMContentLoaded', function() {
    updateTrackInfo();

    document.getElementById('playPauseButton').addEventListener('click', togglePlayPause);
    document.getElementById('nextButton').addEventListener('click', () => controlYouTube('next'));
    document.getElementById('prevButton').addEventListener('click', () => controlYouTube('prev'));
});

function updateTrackInfo() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "getTrackInfo"}, function(response) {
            if (response) {
                document.getElementById('trackTitle').textContent = response.title;
                document.getElementById('trackArtist').textContent = response.artist;
                updatePlayPauseButton(response.isPlaying);
            }
        });
    });
}

function updatePlayPauseButton(isPlaying) {
    const button = document.getElementById('playPauseButton');
    button.textContent = isPlaying ? 'Pause' : 'Play';
}

function togglePlayPause() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "controlYouTube", control: "pause"}, () => {
            setTimeout(updateTrackInfo, 100);
        });
    });
}

function controlYouTube(action) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "controlYouTube", control: action}, () => {
            setTimeout(updateTrackInfo, 500);
        });
    });
}