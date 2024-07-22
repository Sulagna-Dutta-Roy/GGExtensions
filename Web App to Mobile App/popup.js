document.getElementById('navigate').addEventListener('click', function() {
    chrome.tabs.create({ url: 'https://www.webintoapp.com/login' });
  });