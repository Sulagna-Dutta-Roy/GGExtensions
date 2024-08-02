chrome.runtime.onInstalled.addListener(() => {
    console.log('MyMuzie extension installed');
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getTrackInfo') {
      // Implement track info fetching logic here
      sendResponse({title: 'Sample Track', artist: 'Sample Artist'});
    }
  });