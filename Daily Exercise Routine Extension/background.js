// Create two alarms to remind the user to exercise twice a day
chrome.alarms.create("morning", { when: new Date().setHours(9, 0, 0, 0), periodInMinutes: 1440 });
chrome.alarms.create("evening", { when: new Date().setHours(17, 0, 0, 0), periodInMinutes: 1440 });

// Handle the alarms and show notifications
chrome.alarms.onAlarm.addListener(function(alarm) {
  var notificationOptions = {
    type: "basic",
    iconUrl: "icon.png",
    title: "Daily Exercise Reminder",
    message: "Ok, it's time to work out!"
  };
  chrome.notifications.create(notificationOptions);
});
