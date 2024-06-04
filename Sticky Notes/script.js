let selectedColor = '#ffeb3b';

document.getElementById('addNote').addEventListener('click', addNote);

document.querySelectorAll('.color-option').forEach(button => {
    button.addEventListener('click', () => {
        selectedColor = button.getAttribute('data-color');
        document.querySelectorAll('.color-option').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
    });
});

function addNote() {
    const note = document.createElement('div');
    note.classList.add('note');
    note.style.backgroundColor = selectedColor;

    const textArea = document.createElement('textarea');
    textArea.placeholder = 'Write a note...';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'X';
    deleteBtn.classList.add('delete');
    deleteBtn.addEventListener('click', () => {
        note.remove();
    });

    note.appendChild(textArea);
    note.appendChild(deleteBtn);
    document.getElementById('notesContainer').appendChild(note);
}
