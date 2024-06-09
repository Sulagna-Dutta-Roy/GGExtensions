chrome.alarms.onAlarm.addListener(alarm => {
    chrome.storage.local.get(alarm.name, data => {
        const reminder = data[alarm.name];
        if (reminder) {
            chrome.notifications.create(alarm.name, {
                type: 'basic',
                iconUrl: 'icons/icon128.png',
                title: 'Tab Reminder',
                message: reminder.message,
                priority: 2
            });
        }
    });
});

chrome.notifications.onClicked.addListener(notificationId => {
    chrome.storage.local.get(notificationId, data => {
        const reminder = data[notificationId];
        if (reminder) {
            chrome.tabs.update(reminder.tabId, { active: true });
            chrome.notifications.clear(notificationId);
        }
    });
});