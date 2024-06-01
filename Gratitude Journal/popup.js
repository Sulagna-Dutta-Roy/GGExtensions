document.addEventListener('DOMContentLoaded', function() {
    var saveButton = document.getElementById('save-entry-btn');
    var shareButton = document.getElementById('share-entry-btn');
    var gratitudeEntry = document.getElementById('gratitude-entry');
  
    saveButton.addEventListener('click', function() {
      var entry = gratitudeEntry.value;
      if(entry.trim() !== '') {
        chrome.storage.sync.set({ 'gratitudeEntry': entry }, function() {
          alert('Entry saved successfully!');
        });
      } else {
        alert('Please write something before saving.');
      }
    });
  
    shareButton.addEventListener('click', function() {
      chrome.storage.sync.get('gratitudeEntry', function(data) {
        var entry = data.gratitudeEntry;
        if(entry) {
          // You can implement sharing functionality here
          console.log('Sharing entry: ' + entry);
        } else {
          alert('No entry found to share.');
        }
      });
    });
  });
  