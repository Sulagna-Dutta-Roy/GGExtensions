chrome.runtime.onInstalled.addListener(function() {
  // Set default focus time settings
  chrome.storage.sync.set({
    startTime: "09:00",
    endTime: "17:00",
    blockedWebsites: []
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.storage.sync.get(['startTime', 'endTime', 'blockedWebsites'], function(data) {
    var startTime = data.startTime;
    var endTime = data.endTime;
    var blockedWebsites = data.blockedWebsites || [];

    var currentHour = new Date().getHours();
    var currentMinute = new Date().getMinutes();
    var currentTime = currentHour * 60 + currentMinute;
    var startTimeInMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
    var endTimeInMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);

    if (currentTime >= startTimeInMinutes && currentTime <= endTimeInMinutes) {
      for (var i = 0; i < blockedWebsites.length; i++) {
        if (tab.url.includes(blockedWebsites[i])) {
          chrome.tabs.remove(tabId);
          break;
        }
      }
    }
  });
});
