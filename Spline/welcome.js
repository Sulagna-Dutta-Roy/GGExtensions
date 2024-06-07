document.addEventListener('DOMContentLoaded', function() {
    const welcomeText = "Welcome to the Spline Extension! Explore the world of 3D design.";
    const welcomeElement = document.getElementById('welcome-text');
    const startSplineExtensionButton = document.getElementById('start-spline-extension');
    let i = 0;
  
    function typeWriter() {
      if (i < welcomeText.length) {
        welcomeElement.innerHTML += welcomeText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        startSplineExtensionButton.style.display = 'block';
      }
    }
  
    typeWriter();
  
    startSplineExtensionButton.addEventListener('click', function() {
      chrome.action.setPopup({ popup: 'popup.html' });
      window.location.href = 'popup.html';
    });
  });
  