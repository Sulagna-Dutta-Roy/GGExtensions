document.addEventListener('DOMContentLoaded', function() {
    const welcomeText = "Welcome to the Python Code Editor! Start coding in Python now.";
    const welcomeElement = document.getElementById('welcome-text');
    const startPythonEditorButton = document.getElementById('start-python-editor');
    let i = 0;
  
    function typeWriter() {
      if (i < welcomeText.length) {
        welcomeElement.innerHTML += welcomeText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        startPythonEditorButton.style.display = 'block';
      }
    }
  
    typeWriter();
  
    startPythonEditorButton.addEventListener('click', function() {
      chrome.action.setPopup({ popup: 'popup.html' });
      window.location.href = 'popup.html';
    });
  });