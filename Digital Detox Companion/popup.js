document.getElementById('blockSite').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const currentTab = tabs[0];
      const blockedSites = JSON.parse(localStorage.getItem('blockedSites')) || [];
      blockedSites.push(currentTab.url);
      localStorage.setItem('blockedSites', JSON.stringify(blockedSites));
      alert('Site blocked: ' + currentTab.url);
    });
  });
  
  document.getElementById('startFocusMode').addEventListener('click', () => {
    chrome.tabs.query({}, (tabs) => {
      const focusModeSites = ['https://www.example.com'];
      tabs.forEach(tab => {
        if (!focusModeSites.includes(new URL(tab.url).origin)) {
          chrome.tabs.remove(tab.id);
        }
      });
    });
  });
  