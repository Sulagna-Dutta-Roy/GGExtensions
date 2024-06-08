document.addEventListener('DOMContentLoaded', function() {
    const welcomeText = "Welcome! Edit your PDFs with our user-friendly AI PDF Editor.";
    const welcomeElement = document.getElementById('welcome-text');
    const editPdfButton = document.getElementById('edit-pdf');
    let i = 0;
  
    function typeWriter() {
      if (i < welcomeText.length) {
        welcomeElement.innerHTML += welcomeText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        editPdfButton.style.display = 'block';
      }
    }
  
    typeWriter();
  
    editPdfButton.addEventListener('click', function() {
      chrome.action.setPopup({ popup: 'popup.html' });
      window.location.href = 'popup.html';
    });
  });