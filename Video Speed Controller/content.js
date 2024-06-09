chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.speed) {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.playbackRate = parseFloat(message.speed);
    });
  }
});
