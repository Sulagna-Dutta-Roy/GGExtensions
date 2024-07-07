const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "downloadText") {
    browserAPI.downloads.download({
      url: request.url,
      filename: request.filename,
      saveAs: true
    }, () => {
      if (browserAPI.runtime.lastError) {
        console.error("Download failed:", browserAPI.runtime.lastError);
      }
    });
  }
});