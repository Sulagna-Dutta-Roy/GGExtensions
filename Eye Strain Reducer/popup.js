document.getElementById('enable').addEventListener('click', () => {
    const intensity = document.getElementById('intensity').value;
    chrome.storage.sync.set({ filterEnabled: true, filterIntensity: intensity }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: applyFilter,
          args: [intensity]
        });
      });
    });
  });
  
  document.getElementById('disable').addEventListener('click', () => {
    chrome.storage.sync.set({ filterEnabled: false }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: removeFilter
        });
      });
    });
  });
  
  document.getElementById('intensity').addEventListener('input', (event) => {
    const intensity = event.target.value;
    chrome.storage.sync.set({ filterIntensity: intensity }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: applyFilter,
          args: [intensity]
        });
      });
    });
  });
  
  function applyFilter(intensity) {
    let filterStyle = document.getElementById('blue-light-filter');
    if (!filterStyle) {
      filterStyle = document.createElement('style');
      filterStyle.id = 'blue-light-filter';
      document.head.appendChild(filterStyle);
    }
    filterStyle.innerHTML = `
      html {
        filter: brightness(90%) sepia(${intensity}%) hue-rotate(180deg);
      }
    `;
  }
  
  function removeFilter() {
    let filterStyle = document.getElementById('blue-light-filter');
    if (filterStyle) {
      filterStyle.remove();
    }
  }
  