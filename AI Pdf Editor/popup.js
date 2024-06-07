document.addEventListener('DOMContentLoaded', function() {
    const aiPdfEditorLink = document.getElementById('ai-pdf-editor-link');
    aiPdfEditorLink.addEventListener('click', function() {
      chrome.tabs.create({ url: aiPdfEditorLink.href });
    });
  });