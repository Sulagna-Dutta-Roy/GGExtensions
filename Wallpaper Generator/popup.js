// popup.js
document.getElementById('generateWallpaper').addEventListener('click', function() {
    chrome.tabs.executeScript({
      file: 'content.js'
    });
  });
  