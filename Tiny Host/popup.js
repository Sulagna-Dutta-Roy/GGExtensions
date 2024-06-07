document.addEventListener('DOMContentLoaded', function() {
    const tinyHostLink = document.getElementById('tiny-host-link');
    tinyHostLink.addEventListener('click', function() {
      chrome.tabs.create({ url: tinyHostLink.href });
    });
  });
  