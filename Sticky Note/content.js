window.onload = () => {
    const notes = JSON.parse(localStorage.getItem('stickyNotes')) || [];
    notes.forEach(content => {
      const note = document.createElement('div');
      note.className = 'sticky-note';
      note.textContent = content;
      document.body.appendChild(note);
    });
  };
  
