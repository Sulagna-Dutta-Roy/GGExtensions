document.addEventListener('DOMContentLoaded', function() {
    const welcomeMessage = document.getElementById('welcome-message');
    const messages = ["Welcome to W3School Coding Practice!"];
  
    let messageIndex = 0;
    let charIndex = 0;
    let currentMessage = '';
    let currentChars = '';
  
    function typeWriter() {
      if (charIndex < messages[messageIndex].length) {
        currentChars += messages[messageIndex].charAt(charIndex);
        welcomeMessage.innerHTML = currentChars + '<span class="cursor">|</span>';
        charIndex++;
        setTimeout(typeWriter, 100);
      } else {
        charIndex = 0;
        currentChars = '';
        messageIndex = (messageIndex + 1) % messages.length;
        setTimeout(typeWriter, 2000);
      }
    }
  
    typeWriter();
  
    document.getElementById('navigate-button').addEventListener('click', function() {
      chrome.tabs.create({ url: 'https://www.w3schools.com/exercises/' });
    });
  });
  