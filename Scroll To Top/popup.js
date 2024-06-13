document.getElementById('scrollToTop').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const tab = tabs[0];
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: scrollToTop
      }, (results) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          alert('Cannot run script on this page.');
        } else {
          console.log('Script executed successfully.');
        }
      });
    });
  });
  
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  