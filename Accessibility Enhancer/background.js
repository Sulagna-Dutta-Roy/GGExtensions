chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ fontSize: 'medium', backgroundColor: 'white', contrast: 'normal' });
    console.log('Default settings saved');
  });
  