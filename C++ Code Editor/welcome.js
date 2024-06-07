document.addEventListener('DOMContentLoaded', function() {
    const welcomeText = "Welcome to the C++ Code Editor! Enhance your C++ coding skills with Online GDB.";
    const welcomeElement = document.getElementById('welcome-text');
    const startCppEditorButton = document.getElementById('start-cpp-editor');
    let i = 0;
  
    function typeWriter() {
      if (i < welcomeText.length) {
        welcomeElement.innerHTML += welcomeText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        startCppEditorButton.style.display = 'block';
      }
    }
  
    typeWriter();
  
    startCppEditorButton.addEventListener('click', function() {
      chrome.action.setPopup({ popup: 'popup.html' });
      window.location.href = 'popup.html';
    });
  });
  