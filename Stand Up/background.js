chrome.runtime.onInstalled.addListener(function() {
  chrome.alarms.create('standUpReminder', {
    periodInMinutes: 60 // Remind every 60 minutes
  });
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === 'standUpReminder') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon48.png',
      title: 'Stand Up Reminder',
      message: 'It\'s time to stand up and stretch!',
      requireInteraction: true
    });
  }
});
