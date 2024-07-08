const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

document.getElementById('screenshot').addEventListener('click', () => {
  browserAPI.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const tab = tabs[0];
    if (tab.url.startsWith("chrome://") || tab.url.startsWith("about:")) {
      alert("Cannot capture screenshot of browser pages.");
      return;
    }
    browserAPI.tabs.captureVisibleTab(null, {format: 'png'}, (dataUrl) => {
      if (browserAPI.runtime.lastError) {
        alert("Error capturing screenshot: " + browserAPI.runtime.lastError.message);
        return;
      }
      browserAPI.downloads.download({
        url: dataUrl,
        filename: 'screenshot.png',
        saveAs: true
      });
    });
  });
});

document.getElementById('extractText').addEventListener('click', () => {
  browserAPI.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const tab = tabs[0];
    if (tab.url.startsWith("chrome://") || tab.url.startsWith("about:")) {
      alert("Cannot extract text from browser pages.");
      return;
    }
    browserAPI.tabs.executeScript(
      tab.id,
      { file: 'extractText.js' },
      (results) => {
        if (browserAPI.runtime.lastError) {
          alert("Error extracting text: " + browserAPI.runtime.lastError.message);
        }
      }
    );
  });
});