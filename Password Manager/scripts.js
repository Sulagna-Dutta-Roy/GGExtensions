document.addEventListener('DOMContentLoaded', () => {
    const passwordForm = document.getElementById('passwordForm');
    const passwordList = document.getElementById('passwordList');
    const securityKeyModal = document.getElementById('securityKeyModal');
    const securityKeyForm = document.getElementById('securityKeyForm');

    let currentPasswordIndex = null;

    const showSecurityKeyModal = (index = null) => {
        currentPasswordIndex = index;
        securityKeyModal.style.display = 'block';
    };

    const hideSecurityKeyModal = () => {
        securityKeyModal.style.display = 'none';
        currentPasswordIndex = null;
    };

    const getSecurityKey = () => {
        return localStorage.getItem('securityKey');
    };

    const setSecurityKey = (key) => {
        localStorage.setItem('securityKey', key);
    };

    const encrypt = (text, key) => {
        return btoa(text.split('').map(char => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(0))).join(''));
    };

    const decrypt = (text, key) => {
        return atob(text).split('').map(char => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(0))).join('');
    };

    securityKeyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const securityKey = document.getElementById('securityKey').value;
        if (!getSecurityKey()) {
            setSecurityKey(securityKey);
        }
        if (currentPasswordIndex !== null) {
            displayDecryptedPassword(currentPasswordIndex, securityKey);
        }
        hideSecurityKeyModal();
    });

    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const site = document.getElementById('site').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const securityKey = getSecurityKey();
        if (securityKey) {
            savePassword(site, username, encrypt(password, securityKey));
            displayPasswords();
        } else {
            showSecurityKeyModal();
        }
        
        passwordForm.reset();
    });

    const savePassword = (site, username, password) => {
        const passwords = JSON.parse(localStorage.getItem('passwords')) || [];
        passwords.push({ site, username, password });
        localStorage.setItem('passwords', JSON.stringify(passwords));
    };

    const displayPasswords = () => {
        const passwords = JSON.parse(localStorage.getItem('passwords')) || [];
        passwordList.innerHTML = '';
        passwords.forEach(({ site, username, password }, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div><strong>Site:</strong> ${site}</div>
                <div><strong>Username:</strong> ${username}</div>
                <div><strong>Password:</strong> <span class="encrypted-password">${password}</span></div>
                <button class="view-btn" data-index="${index}">View</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            passwordList.appendChild(li);
        });
        attachEventListeners();
    };

    const attachEventListeners = () => {
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                showSecurityKeyModal(index);
            });
        });

        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                deletePassword(index);
            });
        });
    };

    const displayDecryptedPassword = (index, key) => {
        const passwords = JSON.parse(localStorage.getItem('passwords')) || [];
        const { site, username, password } = passwords[index];
        const decryptedPassword = decrypt(password, key);

        passwordList.children[index].querySelector('.encrypted-password').innerText = decryptedPassword;
    };

    const deletePassword = (index) => {
        const passwords = JSON.parse(localStorage.getItem('passwords')) || [];
        passwords.splice(index, 1);
        localStorage.setItem('passwords', JSON.stringify(passwords));
        displayPasswords();
    };

    if (!getSecurityKey()) {
        showSecurityKeyModal();
    } else {
        displayPasswords();
    }
});