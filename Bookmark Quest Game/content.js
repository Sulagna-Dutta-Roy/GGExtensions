// This script would interact with the webpage to gather information
// and potentially display creatures. For now, it just sends the page title.

chrome.runtime.sendMessage({
  action: 'updatePageInfo',
  title: document.title
});