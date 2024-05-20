document.addEventListener("DOMContentLoaded", function() {
    const captureButton = document.getElementById("capture");
    const screenshotContainer = document.getElementById("screenshotContainer");
  
    captureButton.addEventListener("click", function() {
      // Capture the visible tab
      chrome.tabs.captureVisibleTab(function(screenshotDataUrl) {
        // Create an image element to hold the screenshot
        const screenshotImage = new Image();
        screenshotImage.src = screenshotDataUrl;
  
        // Prepare HTML content for the new tab
        const newTabHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Screenshot</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f0f0f0; }
              img { max-width: 100%; max-height: 100%; }
            </style>
          </head>
          <body>
            <img src="${screenshotDataUrl}" alt="Screenshot">
          </body>
          </html>
        `;
  
        // Encode HTML content to be used in a new tab URL
        const newTabUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(newTabHtml);
  
        // Open the screenshot in a new tab
        chrome.tabs.create({ url: newTabUrl });
      });
    });
  });
  