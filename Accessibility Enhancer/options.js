document.addEventListener('DOMContentLoaded', () => {
    restoreOptions();
    document.getElementById('optionsForm').addEventListener('submit', saveOptions);
  });
  
  function saveOptions(event) {
    event.preventDefault();
    const fontSize = document.getElementById('fontSize').value;
    const bgColor = document.getElementById('bgColor').value;
    const contrast = document.getElementById('contrast').value;
    chrome.storage.sync.set({
      fontSize,
      bgColor,
      contrast
    }, () => {
      console.log('Options saved');
    });
  }
  
  function restoreOptions() {
    chrome.storage.sync.get(['fontSize', 'bgColor', 'contrast'], (items) => {
      document.getElementById('fontSize').value = items.fontSize || 'medium';
      document.getElementById('bgColor').value = items.bgColor || '#ffffff';
      document.getElementById('contrast').value = items.contrast || 'normal';
    });
  }
  