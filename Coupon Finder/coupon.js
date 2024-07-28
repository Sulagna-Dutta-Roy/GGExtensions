document.getElementById('applyCoupons').addEventListener('click', async () => {
    const statusElement = document.getElementById('status');
    statusElement.innerText = 'Searching for coupons...';
    statusElement.className = '';
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.executeScript(tabs[0].id, { file: 'content.js' }, (results) => {
        if (chrome.runtime.lastError) {
          statusElement.innerText = 'Failed to apply coupons.';
          statusElement.className = 'error';
        } else {
          statusElement.innerText = 'Coupons applied!';
          statusElement.className = 'success';
        }
      });
    });
  });
  