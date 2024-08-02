document.addEventListener('DOMContentLoaded', function() {
    const pythonEditorLink = document.getElementById('python-editor-link');
    pythonEditorLink.addEventListener('click', function() {
      chrome.tabs.create({ url: "https://replit.com/" });
    });
  });