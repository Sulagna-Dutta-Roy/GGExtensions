document.addEventListener('DOMContentLoaded', function () {
  var clearBtn = document.getElementById('clearBtn');
  clearBtn.addEventListener('click', function () {
    clearBrowserData();
  });
});

function clearBrowserData() {
  chrome.browsingData.remove({
    "since": 0
  }, {
    "appcache": true,
    "cache": true,
    "cookies": true,
    "downloads": true,
    "fileSystems": true,
    "formData": true,
    "history": true,
    "indexedDB": true,
    "localStorage": true,
    "pluginData": true,
    "passwords": true,
    "serviceWorkers": true,
    "webSQL": true
  }, function () {
    alert('Browsing data cleared.');
  });
}
