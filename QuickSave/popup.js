// popup.js
document.addEventListener('DOMContentLoaded', function() {
    var noteTextarea = document.getElementById('note');
    var saveNoteButton = document.getElementById('saveNote');
  
    // Load any saved note
    chrome.storage.sync.get('note', function(data) {
      if (data.note) {
        noteTextarea.value = data.note;
      }
    });
  
    // Save the note when the button is clicked
    saveNoteButton.addEventListener('click', function() {
      var note = noteTextarea.value;
      chrome.storage.sync.set({ 'note': note }, function() {
        alert('Note saved successfully!');
      });
    });
  });
  