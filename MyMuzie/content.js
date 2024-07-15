let currentVideoId = '';

function detectYouTubeTrack() {
    const videoElement = document.querySelector('video.html5-main-video');
    if (videoElement) {
        const videoId = new URLSearchParams(window.location.search).get('v');
        if (videoId && videoId !== currentVideoId) {
            currentVideoId = videoId;
            fetchVideoDetails(videoId);
        }
    }
}

function fetchVideoDetails(videoId) {
    const titleElement = document.querySelector('h1.title.style-scope.ytd-video-primary-info-renderer');
    const channelElement = document.querySelector('yt-formatted-string#text.ytd-channel-name');
    
    if (titleElement && channelElement) {
        const trackInfo = {
            title: titleElement.textContent.trim(),
            artist: channelElement.textContent.trim(),
            videoId: videoId
        };
        
        chrome.runtime.sendMessage({action: 'trackDetected', trackInfo: trackInfo});
    }
}

function controlYouTube(action) {
    const video = document.querySelector('video');
    if (!video) return;

    switch(action) {
        case 'play':
            video.play();
            break;
        case 'pause':
            video.pause();
            break;
        case 'next':
            document.querySelector('.ytp-next-button').click();
            break;
        case 'prev':
            document.querySelector('.ytp-prev-button').click();
            break;
    }
}

// Run detection every second
setInterval(detectYouTubeTrack, 1000);

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTrackInfo") {
        const videoElement = document.querySelector('video.html5-main-video');
        if (videoElement) {
            const titleElement = document.querySelector('h1.title.style-scope.ytd-video-primary-info-renderer');
            const channelElement = document.querySelector('yt-formatted-string#text.ytd-channel-name');
            
            sendResponse({
                title: titleElement ? titleElement.textContent.trim() : 'Unknown',
                artist: channelElement ? channelElement.textContent.trim() : 'Unknown',
                isPlaying: !videoElement.paused
            });
        } else {
            sendResponse({title: 'No video playing', artist: 'Unknown', isPlaying: false});
        }
    } else if (request.action === "controlYouTube") {
        controlYouTube(request.control);
        sendResponse({success: true});
    }
    return true;
});