document.getElementById('increaseText').addEventListener('click', () => {
    chrome.scripting.executeScript({
      target: { tabId: chrome.tabs.Tab.id },
      function: increaseTextSize
    });
  });
  
  document.getElementById('decreaseText').addEventListener('click', () => {
    chrome.scripting.executeScript({
      target: { tabId: chrome.tabs.Tab.id },
      function: decreaseTextSize
    });
  });
  
  document.getElementById('changeBg').addEventListener('click', () => {
    chrome.scripting.executeScript({
      target: { tabId: chrome.tabs.Tab.id },
      function: changeBackgroundColor
    });
  });
  
  document.getElementById('increaseContrast').addEventListener('click', () => {
    chrome.scripting.executeScript({
      target: { tabId: chrome.tabs.Tab.id },
      function: increaseContrast
    });
  });
  
  document.getElementById('decreaseContrast').addEventListener('click', () => {
    chrome.scripting.executeScript({
      target: { tabId: chrome.tabs.Tab.id },
      function: decreaseContrast
    });
  });
  