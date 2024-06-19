document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      const librariesList = document.getElementById('libraries');
      librariesList.innerHTML = ''; // Clear the list first
      if (message.libraries.length > 0) {
        message.libraries.forEach(library => {
          const listItem = document.createElement('li');
          listItem.textContent = `${library.name} (version: ${library.version})`;
          librariesList.appendChild(listItem);
        });
      } else {
        const listItem = document.createElement('li');
        listItem.textContent = 'No libraries detected.';
        librariesList.appendChild(listItem);
      }
    });
  });
  