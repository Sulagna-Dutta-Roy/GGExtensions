document.addEventListener('DOMContentLoaded', function () {
    const profileNameInput = document.getElementById('profileName');
    const profileLinkInput = document.getElementById('profileLink');
    const saveProfileButton = document.getElementById('saveProfile');
    const profileList = document.getElementById('profileList');

    saveProfileButton.addEventListener('click', function () {
        const name = profileNameInput.value;
        const link = profileLinkInput.value;
        if (name && link) {
            saveProfile(name, link);
            profileNameInput.value = '';
            profileLinkInput.value = '';
            loadProfiles();
        }
    });

    function saveProfile(name, link) {
        chrome.storage.sync.get('profiles', function (data) {
            const profiles = data.profiles || {};
            profiles[name] = link;
            chrome.storage.sync.set({ profiles });
        });
    }

    function loadProfiles() {
        chrome.storage.sync.get('profiles', function (data) {
            const profiles = data.profiles || {};
            profileList.innerHTML = '';
            for (const [name, link] of Object.entries(profiles)) {
                const li = document.createElement('li');
                li.textContent = `${name}: `;
                const a = document.createElement('a');
                a.href = link;
                a.textContent = link;
                a.target = '_blank';
                li.appendChild(a);
                profileList.appendChild(li);
            }
        });
    }

    loadProfiles();
});