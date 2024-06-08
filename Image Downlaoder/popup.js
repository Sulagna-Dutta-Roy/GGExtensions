document.getElementById('download-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const imageUrl = document.getElementById('imageUrl').value;
    
    if (imageUrl) {
      chrome.downloads.download({
        url: imageUrl,
        filename: 'downloaded_image.jpg',
        saveAs: true
      }, function(downloadId) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          alert('Failed to download image. Please try again.');
        } else {
          alert('Image download started!');
        }
      });
    } else {
      alert('Please enter a valid image URL.');
    }
  });
  