document.addEventListener('DOMContentLoaded', () => {
    // Find GitHub profiles on the current page
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { message: 'getGitHubProfiles' }, (response) => {
            const profiles = response.profiles;
            const profilesContainer = document.getElementById('profiles');

            if (profiles.length > 0) {
                profiles.forEach(profile => {
                    const link = document.createElement('a');
                    link.href = profile;
                    link.textContent = profile;
                    link.target = '_blank';
                    profilesContainer.appendChild(link);
                });
            } else {
                profilesContainer.textContent = 'No GitHub profiles found on this page.';
            }
        });
    });

    // Handle GitHub username search
    document.getElementById('search-button').addEventListener('click', () => {
        const username = document.getElementById('search-input').value.trim();
        if (username) {
            const profileUrl = `https://github.com/${username}`;
            window.open(profileUrl, '_blank');
        } else {
            alert('Please enter a GitHub username.');
        }
    });
});  