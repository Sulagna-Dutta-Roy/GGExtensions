document.getElementById('clear').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          const canvas = document.querySelector('canvas');
          if (canvas) {
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
      });
    });
  });
  
  document.getElementById('close').addEventListener('click', () => {
    window.close();
  });
  