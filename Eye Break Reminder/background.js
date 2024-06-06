chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === 'start_break') {
        let breakInterval = parseInt(message.breakInterval) * 60000; 
        let notificationDuration = parseInt(message.notificationDuration) * 1000; 
        
        chrome.alarms.create({ delayInMinutes: breakInterval / 60000 });
        
        chrome.alarms.onAlarm.addListener(function(alarm) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icon.png',
                title: 'Take a break!',
                message: 'It\'s time to rest your eyes for a few minutes.'
            });

            setTimeout(function() {
                chrome.notifications.clear(alarm.name);
            }, notificationDuration);
        });
    }
});
