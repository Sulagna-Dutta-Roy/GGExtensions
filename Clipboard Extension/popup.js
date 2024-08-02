document.addEventListener('DOMContentLoaded', () => {
  const clipboardContent = document.getElementById('clipboardContent');
  const clipboardHistory = document.getElementById('clipboardHistory');
  const copyButton = document.getElementById('copyButton');
  const pasteButton = document.getElementById('pasteButton');

  function updateHistory() {
    chrome.storage.local.get(['clipboardHistory'], (result) => {
      clipboardHistory.innerHTML = '';
      const history = result.clipboardHistory || [];
      history.forEach((item, index) => {
        const listItem = document.createElement('li');
        
        const itemText = document.createElement('span');
        itemText.textContent = item;

        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.className = 'copy';
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(item);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
          history.splice(index, 1);
          chrome.storage.local.set({ clipboardHistory: history }, updateHistory);
        });

        listItem.appendChild(itemText);
        listItem.appendChild(copyBtn);
        listItem.appendChild(deleteBtn);
        clipboardHistory.appendChild(listItem);
      });
    });
  }

  copyButton.addEventListener('click', () => {
    const text = clipboardContent.value;
    navigator.clipboard.writeText(text).then(() => {
      chrome.storage.local.get(['clipboardHistory'], (result) => {
        const history = result.clipboardHistory || [];
        history.unshift(text);
        chrome.storage.local.set({ clipboardHistory: history.slice(0, 20) });
        updateHistory();
      });
    });
  });

  pasteButton.addEventListener('click', () => {
    navigator.clipboard.readText().then(text => {
      clipboardContent.value = text;
    });
  });

  updateHistory();
});
