document.addEventListener('DOMContentLoaded', function() {
    const aiPhotoEditorLink = document.getElementById('ai-photo-editor-link');
    aiPhotoEditorLink.addEventListener('click', function() {
      chrome.tabs.create({ url: aiPhotoEditorLink.href });
    });
  });
  