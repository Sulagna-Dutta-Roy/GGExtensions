document.getElementById('run-tests').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'runTests' }, (response) => {
      document.getElementById('output').textContent = response;
    });
  });
  
  document.getElementById('check-quality').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'monitorCodeQuality' }, (response) => {
      document.getElementById('output').textContent = response;
    });
  });
  
  document.getElementById('scan-dependencies').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'scanDependencies' }, (response) => {
      document.getElementById('output').textContent = response;
    });
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
      case 'runTests':
        runTests();
        break;
      case 'monitorCodeQuality':
        monitorCodeQuality();
        break;
      case 'scanDependencies':
        scanDependencies();
        break;
    }
  });
  