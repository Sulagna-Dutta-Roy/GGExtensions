document.addEventListener('DOMContentLoaded', function() {
    const aiUIUXDesignerLink = document.getElementById('ai-uiux-designer-link');
    aiUIUXDesignerLink.addEventListener('click', function() {
      chrome.tabs.create({ url: aiUIUXDesignerLink.href });
    });
  });
  