document.getElementById('navigate').addEventListener('click', function() {
    chrome.tabs.create({ url: 'welcome.html' });
  });
  