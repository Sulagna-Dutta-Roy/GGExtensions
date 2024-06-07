document.getElementById('save-settings').addEventListener('click', function() {
    let breakInterval = document.getElementById('break-interval').value;
    let notificationDuration = document.getElementById('notification-duration').value;

    chrome.storage.sync.set({ breakInterval: breakInterval, notificationDuration: notificationDuration }, function() {
        alert('Settings saved!');
    });
});

document.getElementById('start-break').addEventListener('click', function() {
    chrome.storage.sync.get(['breakInterval', 'notificationDuration'], function(result) {
        let breakInterval = result.breakInterval || 20; 
        let notificationDuration = result.notificationDuration || 10; 

        chrome.runtime.sendMessage({ type: 'start_break', breakInterval: breakInterval, notificationDuration: notificationDuration });
    });
});
