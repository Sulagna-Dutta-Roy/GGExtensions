// Function to find GitHub profile links
function findGitHubProfiles() {
    const links = document.querySelectorAll('a[href*="github.com"]');
    const profiles = [];

    links.forEach(link => {
        const url = new URL(link.href);
        if (url.hostname === 'github.com' && url.pathname.split('/').length === 2) {
            profiles.push(url.href);
        }
    });

    return [...new Set(profiles)]; // Remove duplicates
}

// Send found profiles to the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'getGitHubProfiles') {
        const profiles = findGitHubProfiles();
        sendResponse({ profiles });
    }
});
