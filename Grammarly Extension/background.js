chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "checkGrammar",
    title: "Check Grammar and Style",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "checkGrammar") {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ["contentScript.js"],
    });
  }
});
