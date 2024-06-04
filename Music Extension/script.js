// JavaScript to handle the music player
const audio = document.getElementById('audio');

// You can add more tracks here
const tracks = [
    'music/water.mp3',
    'music/om.mp3',
    'music/moonlight.mp3'
];

let currentTrackIndex = 0;

// Function to play the next track
function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    audio.src = chrome.runtime.getURL(tracks[currentTrackIndex]);
    audio.play();
}

function playPreviousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    audio.src = chrome.runtime.getURL(tracks[currentTrackIndex]);
    audio.play();
}

audio.addEventListener('ended', playNextTrack);

document.getElementById('prev').addEventListener('click', playPreviousTrack);

document.getElementById('next').addEventListener('click', playNextTrack);

audio.src = chrome.runtime.getURL(tracks[currentTrackIndex]);
audio.play();
