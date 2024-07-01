chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ profiles: {} }, function () {
      console.log("Social media profiles initialized.");
    });
  });
  
  chrome.alarms.onAlarm.addListener(function () {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Notification',
      message: 'Check your social media updates!'
    });
  });
  
  chrome.alarms.create('socialMediaAlarm', { periodInMinutes: 60 });  // Set an alarm to notify every hour
  