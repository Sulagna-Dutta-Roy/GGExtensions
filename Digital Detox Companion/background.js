chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'breakReminder') {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon.png',
        title: 'Time for a Break!',
        message: 'Take a short break to stay productive.'
      });
    }
  });
  
  chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create('breakReminder', { periodInMinutes: 60 });
  });
  