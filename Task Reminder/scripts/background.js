chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({tasks: []}, function() {
      console.log('Initialized tasks storage.');
    });
  });  