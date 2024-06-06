document.getElementById('saveOptions').addEventListener('click', () => {
    const profession = document.getElementById('profession').value;
    if (profession) {
      chrome.storage.sync.set({ profession }, () => {
        alert('Profession saved: ' + profession);
      });
    } else {
      alert('Profession cannot be empty.');
    }
  });
  
  chrome.storage.sync.get('profession', (data) => {
    if (data.profession) {
      document.getElementById('profession').value = data.profession;
    }
  });
  