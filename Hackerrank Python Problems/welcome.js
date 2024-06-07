document.addEventListener('DOMContentLoaded', function() {
    const welcomeText = "Welcome! Enhance your Python skills with HackerRank problems.";
    const welcomeElement = document.getElementById('welcome-text');
    const startHackerrankPythonButton = document.getElementById('start-hackerrank-python');
    let i = 0;
  
    function typeWriter() {
      if (i < welcomeText.length) {
        welcomeElement.innerHTML += welcomeText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        startHackerrankPythonButton.style.display = 'block';
      }
    }
  
    typeWriter();
  
    startHackerrankPythonButton.addEventListener('click', function() {
      chrome.action.setPopup({ popup: 'popup.html' });
      window.location.href = 'popup.html';
    });
  });