document.addEventListener('DOMContentLoaded', function() {
    const welcomeText = "Welcome! Edit your photos with our user-friendly AI Photo Editor.";
    const welcomeElement = document.getElementById('welcome-text');
    const editPhotoButton = document.getElementById('edit-photo');
    let i = 0;
  
    function typeWriter() {
      if (i < welcomeText.length) {
        welcomeElement.innerHTML += welcomeText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        editPhotoButton.style.display = 'block';
      }
    }
  
    typeWriter();
  
    editPhotoButton.addEventListener('click', function() {
      chrome.action.setPopup({ popup: 'popup.html' });
      window.location.href = 'popup.html';
    });
  });
  