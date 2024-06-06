document.addEventListener('DOMContentLoaded', function() {
    const welcomeText = "Welcome! Start your project with Tiny Host live server.";
    const welcomeElement = document.getElementById('welcome-text');
    const startTinyHostButton = document.getElementById('start-tiny-host');
    let i = 0;
  
    function typeWriter() {
      if (i < welcomeText.length) {
        welcomeElement.innerHTML += welcomeText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        startTinyHostButton.style.display = 'block';
      }
    }
  
    typeWriter();
  
    startTinyHostButton.addEventListener('click', function() {
      chrome.action.setPopup({ popup: 'popup.html' });
      window.location.href = 'popup.html';
    });
  });
  