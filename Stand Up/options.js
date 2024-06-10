document.addEventListener('DOMContentLoaded', function() {
  const reminderIntervalInput = document.getElementById('reminderInterval');
  const saveButton = document.getElementById('saveButton');

  chrome.storage.sync.get(['reminderInterval'], function(result) {
    reminderIntervalInput.value = result.reminderInterval || 60;
  });

  saveButton.addEventListener('click', function() {
    const interval = parseInt(reminderIntervalInput.value);
    chrome.storage.sync.set({ reminderInterval: interval }, function() {
      console.log('Reminder interval set to ' + interval + ' minutes.');
      window.close();
    });
  });
});
