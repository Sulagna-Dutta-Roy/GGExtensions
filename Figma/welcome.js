document.addEventListener('DOMContentLoaded', function() {
    const welcomeText = "Welcome to the Figma Extension! Enhance your design experience with Figma.";
    const welcomeElement = document.getElementById('welcome-text');
    const startFigmaExtensionButton = document.getElementById('start-figma-extension');
    let i = 0;
  
    function typeWriter() {
      if (i < welcomeText.length) {
        welcomeElement.innerHTML += welcomeText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        startFigmaExtensionButton.style.display = 'block';
      }
    }
  
    typeWriter();
  
    startFigmaExtensionButton.addEventListener('click', function() {
      chrome.action.setPopup({ popup: 'popup.html' });
      window.location.href = 'popup.html';
    });
  });
  