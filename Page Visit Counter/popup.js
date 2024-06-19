document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('visitCountsTable').getElementsByTagName('tbody')[0];
  
    chrome.storage.local.get(null, (items) => {
      const sortedItems = Object.keys(items).sort((a, b) => items[b] - items[a]);
  
      sortedItems.forEach((url) => {
        const row = tableBody.insertRow();
        const cellUrl = row.insertCell(0);
        const cellCount = row.insertCell(1);
  
        cellUrl.textContent = url;
        cellCount.textContent = items[url];
      });
    });
  });
  