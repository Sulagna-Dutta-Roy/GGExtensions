document.addEventListener('DOMContentLoaded', function() {
    const cppEditorLink = document.getElementById('cpp-editor-link');
    cppEditorLink.addEventListener('click', function() {
      chrome.tabs.create({ url: cppEditorLink.href });
    });
  });
  