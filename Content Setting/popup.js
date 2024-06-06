let incognito;
let url;

function settingChanged() {
  let type = this.id;
  let setting = this.value;
  let pattern = /^file:/.test(url) ? url : url.replace(/\/[^/]*?$/, '/*');
  console.log(type + ' setting for ' + pattern + ': ' + setting);
  chrome.contentSettings[type].set({
    primaryPattern: pattern,
    setting: setting,
    scope: incognito ? 'incognito_session_only' : 'regular'
  });
}

document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let current = tabs[0];
    incognito = current.incognito;
    url = current.url;
    let types = [
      'cookies',
      'images',
      'javascript',
      'location',
      'popups',
      'notifications',
      'microphone',
      'camera',
      'automaticDownloads'
    ];
    types.forEach(function (type) {
      chrome.contentSettings[type] &&
        chrome.contentSettings[type].get(
          {
            primaryUrl: url,
            incognito: incognito
          },
          function (details) {
            document.getElementById(type).disabled = false;
            document.getElementById(type).value = details.setting;
          }
        );
    });
  });

  let selects = document.querySelectorAll('select');
  for (let i = 0; i < selects.length; i++) {
    selects[i].addEventListener('change', settingChanged);
  }
});
