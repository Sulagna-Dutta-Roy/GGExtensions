document.getElementById('check').addEventListener('click', () => {
  const username = document.getElementById('username').value;
  if (username) {
    chrome.runtime.sendMessage({ username: username }, (response) => {
      document.getElementById('status').innerText = response.message;
    });
  } else {
    document.getElementById('status').innerText = 'Please enter a username.';
  }
});
