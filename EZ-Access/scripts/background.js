chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'insertProfileLink',
        title: 'Insert Profile Link',
        contexts: ['editable']
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'insertProfileLink') {
        chrome.storage.sync.get('profiles', (data) => {
            const profiles = data.profiles || {};
            const profileLinks = Object.values(profiles);
            if (profileLinks.length > 0) {
                const selectedLink = profileLinks[0]; // For simplicity, use the first profile link
                chrome.tabs.sendMessage(tab.id, { action: 'insertProfileLink', link: selectedLink });
            }
        });
    }
});