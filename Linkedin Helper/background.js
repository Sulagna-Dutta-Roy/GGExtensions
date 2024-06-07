chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'jobAlert') {
      chrome.storage.sync.get('profession', (data) => {
        fetchJobs(data.profession);
      });
    }
  });
  
  function fetchJobs(profession) {
    // Mock data for job listings
    const mockJobs = [
      { title: 'Software Engineer', company: 'Tech Corp' },
      { title: 'Project Manager', company: 'Business Inc.' },
      { title: 'Data Scientist', company: 'Data Analytics' }
    ];
  
    // Simulating network request delay with setTimeout
    setTimeout(() => {
      mockJobs.forEach(job => {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'New Job Alert',
          message: `${job.title} at ${job.company}`
        });
      });
    }, 1000); // Simulating 1-second delay
  }
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'autoMessage') {
      sendAutomatedMessage(message.profileUrl, message.message);
    }
  });
  
  function sendAutomatedMessage(profileUrl, message) {
    chrome.tabs.create({ url: profileUrl }, (tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (msg) => {
          const messageBox = document.querySelector('.message-anywhere');
          if (messageBox) {
            messageBox.value = msg;
            document.querySelector('.send-button').click();
          } else {
            console.error('Message box not found.');
          }
        },
        args: [message]
      }).catch(err => {
        console.error('Script execution error: ', err);
      });
    });
  }
  