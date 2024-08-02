document.addEventListener('DOMContentLoaded', function() {
    const welcomeText = "Welcome to the Java Code Editor! Start coding in Java now.";
    const welcomeElement = document.getElementById('welcome-text');
    const startJavaEditorButton = document.getElementById('start-java-editor');
    let i = 0;
  
    function typeWriter() {
      if (i < welcomeText.length) {
        welcomeElement.innerHTML += welcomeText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        startJavaEditorButton.style.display = 'block';
      }
    }
  
    typeWriter();
  
    startJavaEditorButton.addEventListener('click', function() {
      chrome.action.setPopup({ popup: 'popup.html' });
      window.location.href = 'popup.html';
    });
  });
  