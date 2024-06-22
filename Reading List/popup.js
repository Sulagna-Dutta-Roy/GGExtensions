// popup.js
document.addEventListener('DOMContentLoaded', function() {
  const savePageButton = document.getElementById('savePage');
  const readingListElement = document.getElementById('readingList');

  savePageButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const url = tabs[0].url;
      chrome.storage.sync.get({ readingList: [] }, function(data) {
        const readingList = data.readingList;
        if (!readingList.includes(url)) {
          readingList.push(url);
          chrome.storage.sync.set({ readingList: readingList }, function() {
            displayReadingList();
          });
        }
      });
    });
  });

  function displayReadingList() {
    chrome.storage.sync.get({ readingList: [] }, function(data) {
      const readingList = data.readingList;
      readingListElement.innerHTML = '';
      readingList.forEach(function(url, index) {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = url;
        link.textContent = url;
        link.target = '_blank';

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.style.marginLeft = '10px';
        removeButton.style.backgroundColor = '#e74c3c';
        removeButton.style.color = 'white';
        removeButton.style.border = 'none';
        removeButton.style.borderRadius = '4px';
        removeButton.style.padding = '5px';
        removeButton.style.cursor = 'pointer';

        removeButton.addEventListener('click', function() {
          readingList.splice(index, 1);
          chrome.storage.sync.set({ readingList: readingList }, function() {
            displayReadingList();
          });
        });

        listItem.appendChild(link);
        listItem.appendChild(removeButton);
        readingListElement.appendChild(listItem);
      });
    });
  }

  displayReadingList();
});
