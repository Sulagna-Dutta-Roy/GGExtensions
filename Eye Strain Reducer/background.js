chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ filterEnabled: false, filterIntensity: 30 });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.storage.sync.get(['filterEnabled', 'filterIntensity'], (data) => {
    if (data.filterEnabled) {
      chrome.scripting.executeScript({
        target: { tabId: activeInfo.tabId },
        function: applyFilter,
        args: [data.filterIntensity]
      });
    }
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
