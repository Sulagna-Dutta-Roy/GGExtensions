document.addEventListener('DOMContentLoaded', () => {
    const exportButton = document.getElementById('exportIdentities');
    const importButton = document.getElementById('importIdentities');
    const importFileInput = document.getElementById('importFile');

    function loadIdentities() {
        chrome.storage.sync.get(['identities'], (result) => {
            const identities = result.identities || [];
            const identitiesContainer = document.getElementById('identities');
            identitiesContainer.innerHTML = '';
            identities.forEach((identity, index) => {
                const identityDiv = document.createElement('div');
                identityDiv.className = 'identity';
                identityDiv.innerHTML = `
            <h3>${identity.name}</h3>
            <p>Email: ${identity.email}</p>
            <p>Password: ${identity.password}</p>
          `;
                identitiesContainer.appendChild(identityDiv);
            });
        });
    }

    exportButton.onclick = () => {
        chrome.storage.sync.get(['identities'], (result) => {
            const identities = result.identities || [];
            const blob = new Blob([JSON.stringify(identities, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'identities.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    };

    importButton.onclick = () => {
        importFileInput.click();
    };

    importFileInput.onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const identities = JSON.parse(e.target.result);
            chrome.storage.sync.set({ identities }, () => {
                alert('Identities imported successfully!');
                loadIdentities();
            });
        };
        reader.readAsText(file);
    };

    loadIdentities();
});