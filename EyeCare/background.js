// Background script for setting up alarms and handling break reminders
chrome.alarms.create({ delayInMinutes: 20, periodInMinutes: 20 });

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === 'breakReminder') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon48.png',
      title: 'eyeCare Reminder',
      message: 'It\'s time to take a break and do some exercises!'
    });
  }
});
