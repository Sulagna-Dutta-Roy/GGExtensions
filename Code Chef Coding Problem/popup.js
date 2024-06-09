document.getElementById('navigate-button').addEventListener('click', function() {
    chrome.tabs.create({ url: 'https://www.codechef.com/' });
  });
  