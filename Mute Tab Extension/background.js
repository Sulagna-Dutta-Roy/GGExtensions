chrome.action.onClicked.addListener((tab) => {  // Toggle mute state of the current tab
  chrome.tabs.update(tab.id, {muted: !tab.mutedInfo.muted});
});
