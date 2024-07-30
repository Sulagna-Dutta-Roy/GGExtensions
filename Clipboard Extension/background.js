chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ clipboardHistory: [] });
  });
  
  chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get(['clipboardHistory'], (result) => {
      const history = result.clipboardHistory || [];
      console.log('Clipboard History:', history);
    });
  });
  
  // Listen for changes in the clipboard
  chrome.clipboard.onClipboardChanged.addListener(() => {
    navigator.clipboard.readText().then(text => {
      if (text) {
        chrome.storage.local.get(['clipboardHistory'], (result) => {
          const history = result.clipboardHistory || [];
          if (history[0] !== text) {
            history.unshift(text);
            chrome.storage.local.set({ clipboardHistory: history.slice(0, 20) });
          }
        });
      }
    });
  });
  