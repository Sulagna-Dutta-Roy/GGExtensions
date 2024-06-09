document.addEventListener('DOMContentLoaded', function() {
  var startTimeInput = document.getElementById('start-time');
  var endTimeInput = document.getElementById('end-time');
  var blockedWebsitesInput = document.getElementById('blocked-websites');
  var saveSettingsButton = document.getElementById('save-settings');

  chrome.storage.sync.get(['startTime', 'endTime', 'blockedWebsites'], function(data) {
    startTimeInput.value = data.startTime || "09:00";
    endTimeInput.value = data.endTime || "17:00";
    blockedWebsitesInput.value = data.blockedWebsites ? data.blockedWebsites.join(', ') : '';
  });

  saveSettingsButton.addEventListener('click', function() {
    var startTime = startTimeInput.value;
    var endTime = endTimeInput.value;
    var blockedWebsites = blockedWebsitesInput.value.split(',').map(function(website) {
      return website.trim();
    });
    chrome.storage.sync.set({
      'startTime': startTime,
      'endTime': endTime,
      'blockedWebsites': blockedWebsites
    }, function() {
      alert('Focus time settings saved successfully!');
    });
  });
});
