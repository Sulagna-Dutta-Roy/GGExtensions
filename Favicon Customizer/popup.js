document.getElementById('favicon-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const faviconUrl = document.getElementById('favicon-url').value;
  
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tab = tabs[0];
      if (!tab.url.startsWith('chrome://')) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: changeFavicon,
          args: [faviconUrl]
        });
      } else {
        alert("Cannot modify favicons on chrome:// URLs.");
      }
    });
  });
  
  function changeFavicon(faviconUrl) {
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.href = faviconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  