document.addEventListener('DOMContentLoaded', function() {
  const timerInput = document.getElementById('timer');
  const saveButton = document.getElementById('saveButton');

  chrome.storage.sync.get(['timerValue'], function(result) {
    timerInput.value = result.timerValue || 10;
  });

  saveButton.addEventListener('click', function() {
    const timerValue = parseInt(timerInput.value);
    chrome.storage.sync.set({ timerValue: timerValue }, function() {
      console.log('Timer set to ' + timerValue + ' minutes.');
      window.close();
    });
  });
});
