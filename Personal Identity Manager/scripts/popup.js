document.addEventListener('DOMContentLoaded', () => {
    const addIdentityButton = document.getElementById('addIdentity');
    const modal = document.getElementById('addIdentityForm');
    const closeModal = document.getElementsByClassName('close')[0];
    const saveIdentityButton = document.getElementById('saveIdentity');

    addIdentityButton.onclick = () => {
        modal.style.display = 'block';
    };

    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    saveIdentityButton.onclick = () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const identity = {
            name: name,
            email: email,
            password: password
        };

        chrome.runtime.sendMessage({ type: 'saveIdentity', identity: identity }, (response) => {
            if (response.status === 'success') {
                alert('Identity saved successfully!');
                modal.style.display = 'none';
                loadIdentities();
            } else {
                alert('Failed to save identity.');
            }
        });
    };

    function loadIdentities() {
        chrome.runtime.sendMessage({ type: 'getIdentities' }, (identities) => {
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

    loadIdentities();
});