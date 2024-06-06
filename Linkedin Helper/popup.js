document.getElementById('analyzeProfile').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => {
            const button = document.querySelector('button:contains("Analyze Profile")');
            if (button) {
              button.click();
            } else {
              alert('Analyze Profile button not found.');
            }
          }
        }).catch(err => {
          console.error('Script execution error: ', err);
        });
      } else {
        alert('No active tab found.');
      }
    });
  });
  
  document.getElementById('autoMessage').addEventListener('click', () => {
    const profileUrl = prompt('Enter the LinkedIn profile URL:');
    const message = prompt('Enter your message:');
    if (profileUrl && message) {
      chrome.runtime.sendMessage({ type: 'autoMessage', profileUrl, message }, (response) => {
        if (chrome.runtime.lastError) {
          alert('Error: ' + chrome.runtime.lastError.message);
        } else {
          alert('Automated message has been sent.');
        }
      });
    } else {
      alert('Profile URL and message are required.');
    }
  });
  
  document.getElementById('jobAlerts').addEventListener('click', () => {
    const profession = prompt('Enter your profession:');
    if (profession) {
      chrome.storage.sync.set({ profession }, () => {
        chrome.alarms.create('jobAlert', { periodInMinutes: 60 });
        alert('Job alerts set for your profession.');
      });
    } else {
      alert('Profession is required.');
    }
  });
  