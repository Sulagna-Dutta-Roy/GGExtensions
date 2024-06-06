document.addEventListener('DOMContentLoaded', function() {
    const atsLink = document.getElementById('ats-link');
    atsLink.addEventListener('click', function() {
      chrome.tabs.create({ url: atsLink.href });
    });
  });
  