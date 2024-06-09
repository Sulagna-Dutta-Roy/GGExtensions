document.addEventListener('DOMContentLoaded', function() {
  const speedInput = document.querySelector('.speed');
  const speedValue = document.getElementById('speedValue');

  speedInput.addEventListener('input', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {speed: speedInput.value});
    });
    speedValue.textContent = speedInput.value + 'x';
  });
});
