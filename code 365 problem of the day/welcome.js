document.addEventListener('DOMContentLoaded', function() {
    const welcomeText = "Welcome to the Code 360 Problem of the Day!";
    const welcomeElement = document.getElementById('welcome-text');
    const showProblemButton = document.getElementById('show-problem');
    let i = 0;
  
    function typeWriter() {
      if (i < welcomeText.length) {
        welcomeElement.innerHTML += welcomeText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        showProblemButton.style.display = 'block';
      }
    }
  
    typeWriter();
  
    showProblemButton.addEventListener('click', function() {
      chrome.action.setPopup({ popup: 'popup.html' });
      window.location.href = 'popup.html';
    });
  });
  