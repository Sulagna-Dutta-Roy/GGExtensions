document.addEventListener('DOMContentLoaded', function() {
    const welcomeText = "Welcome! Enhance your design process with AI UI/UX Designer.";
    const welcomeElement = document.getElementById('welcome-text');
    const startAIUIUXDesignerButton = document.getElementById('start-ai-uiux-designer');
    let i = 0;
  
    function typeWriter() {
      if (i < welcomeText.length) {
        welcomeElement.innerHTML += welcomeText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        startAIUIUXDesignerButton.style.display = 'block';
      }
    }
  
    typeWriter();
  
    startAIUIUXDesignerButton.addEventListener('click', function() {
      chrome.action.setPopup({ popup: 'popup.html' });
      window.location.href = 'popup.html';
    });
  });
  