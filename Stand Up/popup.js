document.addEventListener('DOMContentLoaded', function() {
  const dismissButton = document.getElementById('dismissButton');
  
  dismissButton.addEventListener('click', function() {
    chrome.alarms.clear('standUpReminder');
    window.close();
  });
});
