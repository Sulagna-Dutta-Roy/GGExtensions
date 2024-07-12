document.getElementById('loginButton').addEventListener('click', () => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError || !token) {
        alert('Authentication failed: ' + chrome.runtime.lastError.message);
        return;
      }
      
      fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      .then(response => response.json())
      .then(user => {
        document.getElementById('login').style.display = 'none';
        document.getElementById('group').style.display = 'block';
        document.getElementById('group').insertAdjacentHTML('afterbegin', `<h3>Welcome, ${user.name}</h3>`);
        // You can add further actions here like initializing real-time database for chat
      })
      .catch(error => console.error('Error:', error));
    });
  });
  
  document.getElementById('sendButton').addEventListener('click', () => {
    const chatInput = document.getElementById('chatInput');
    const chatBox = document.getElementById('chatBox');
    const message = chatInput.value;
    if (message) {
      const p = document.createElement('p');
      p.textContent = message;
      chatBox.appendChild(p);
      chatInput.value = '';
    }
  });
  
  // You can add further functionalities here like saving and syncing notes
  