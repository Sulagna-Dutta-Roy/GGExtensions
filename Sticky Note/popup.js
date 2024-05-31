document.getElementById('create-note').addEventListener('click', () => {
    const content = document.getElementById('note-content').value;
    if (content) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: createStickyNote,
          args: [content]
        });
      });
    }
  });
  
  function createStickyNote(content) {
    const note = document.createElement('div');
    note.className = 'sticky-note';
    note.textContent = content;
    document.body.appendChild(note);
  
    // Save the note in local storage
    const notes = JSON.parse(localStorage.getItem('stickyNotes')) || [];
    notes.push(content);
    localStorage.setItem('stickyNotes', JSON.stringify(notes));
  }
  
