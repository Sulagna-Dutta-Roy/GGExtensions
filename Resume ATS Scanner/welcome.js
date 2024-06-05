document.addEventListener('DOMContentLoaded', function() {
    const welcomeText = "Welcome! Make your resume job-friendly with our ATS Scanner.";
    const welcomeElement = document.getElementById('welcome-text');
    const scanResumeButton = document.getElementById('scan-resume');
    let i = 0;
  
    function typeWriter() {
      if (i < welcomeText.length) {
        welcomeElement.innerHTML += welcomeText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        scanResumeButton.style.display = 'block';
      }
    }
  
    typeWriter();
  
    scanResumeButton.addEventListener('click', function() {
      chrome.action.setPopup({ popup: 'popup.html' });
      window.location.href = 'popup.html';
    });
  });
  