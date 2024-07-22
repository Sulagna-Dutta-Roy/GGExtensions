document.getElementById('downloadBtn').addEventListener('click', downloadVideo);

async function downloadVideo() {
    const videoUrl = document.getElementById('videoUrl').value;
    const quality = document.getElementById('quality').value; // Get selected quality

    // Validate YouTube URL
    if (!isValidYouTubeUrl(videoUrl)) {
        alert('Please enter a valid YouTube video URL.');
        return;
    }

    // Extract video ID from URL
    const videoId = extractVideoId(videoUrl);

    try {
        // Show downloading message
        showMessage('Downloading...');

        console.log(`Fetching video from: http://localhost:3000/download?videoId=${videoId}&quality=${quality}`);
        const response = await fetch(`http://localhost:3000/download?videoId=${videoId}&quality=${quality}`);

        if (!response.ok) {
            const errorMessage = await response.text(); // Get the error message from the response
            throw new Error(`Network response was not ok: ${response.statusText}. Error message: ${errorMessage}`);
        }

        // Get the blob from the response
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Create a link element and trigger a download
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'video.mp4'; // You can dynamically set the file name
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

        // Show download completed message
        showMessage('Download completed.');
    } catch (error) {
        console.error('Error downloading the video:', error);
        showMessage('Error downloading the video.');
    }
}

function isValidYouTubeUrl(url) {
    return /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/i.test(url);
}

function extractVideoId(url) {
    let videoId = '';
    const urlParams = new URLSearchParams(new URL(url).search);
    if (url.includes('youtube.com') && urlParams.has('v')) {
        videoId = urlParams.get('v');
    } else if (url.includes('youtu.be')) {
        const pathname = new URL(url).pathname;
        videoId = pathname.substr(1);
    }

    const videoIdRegex = /^[a-zA-Z0-9-_]{11}$/;
    if (!videoIdRegex.test(videoId)) {
        throw new Error(`Invalid video ID: ${videoId}`);
    }

    return videoId;
}

function showMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerText = message;
}
