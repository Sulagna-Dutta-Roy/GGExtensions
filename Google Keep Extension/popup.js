document.getElementById('saveButton').addEventListener('click', () => {
    const noteText = document.getElementById('noteText').value;
    if (noteText) {
        chrome.storage.sync.set({ 'note': noteText }, () => {
            alert('Note saved!');
        });
    } else {
        alert('Please write something before saving.');
    }
});
