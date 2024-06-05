// popup.js
document.addEventListener('DOMContentLoaded', () => {
    const suspensionTimeInput = document.getElementById('suspension-time');
    const saveSettingsButton = document.getElementById('save-settings');
    const suspendAllButton = document.getElementById('suspend-all');
    const unsuspendAllButton = document.getElementById('unsuspend-all');
    const exclusionsTextarea = document.getElementById('exclusions');

    // Load saved settings
    chrome.storage.sync.get(['suspensionTime', 'exclusions'], (data) => {
        if (data.suspensionTime) suspensionTimeInput.value = data.suspensionTime;
        if (data.exclusions) exclusionsTextarea.value = data.exclusions.join(', ');
    });

    // Save settings
    saveSettingsButton.addEventListener('click', () => {
        const suspensionTime = parseInt(suspensionTimeInput.value);
        const exclusions = exclusionsTextarea.value.split(',').map(url => url.trim());
        chrome.storage.sync.set({ suspensionTime, exclusions }, () => {
            alert('Settings saved');
        });
    });

    // Suspend all tabs
    suspendAllButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'suspendAll' });
    });

    // Unsuspend all tabs
    unsuspendAllButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'unsuspendAll' });
    });
});
