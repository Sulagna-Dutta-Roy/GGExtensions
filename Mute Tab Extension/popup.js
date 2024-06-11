document.getElementById("muteButton").addEventListener("click", () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const currentTab = tabs[0];
    chrome.tabs.update(currentTab.id, {muted: !currentTab.mutedInfo.muted});
  });
});
