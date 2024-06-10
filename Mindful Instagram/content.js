chrome.storage.sync.get(['timerValue'], function(result) {
  const timerValue = result.timerValue || 10; // Default timer value if not set
  const milliseconds = timerValue * 60000; // Convert minutes to milliseconds

  setTimeout(function() {
    // Your code to hide non-essential elements on Instagram goes here
    console.log('Timer expired. Hiding non-essential elements...');
  }, milliseconds);
});
