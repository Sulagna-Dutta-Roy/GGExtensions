// popup.js
document.addEventListener('DOMContentLoaded', () => {
    const shortcutInput = document.getElementById('shortcut');
    const setShortcutButton = document.getElementById('set-shortcut');
    const shortcutsList = document.getElementById('shortcuts');
    let currentAction = document.getElementById('action').value;
    const reservedShortcuts = ['Ctrl+P', 'Ctrl+T', 'Ctrl+W', 'Ctrl+N', 'Ctrl+Shift+N', 'Ctrl+R', 'Ctrl+Shift+R', 'Ctrl+L', 'Ctrl+K', 'Ctrl+D', 'Ctrl+F'];

    document.getElementById('action').addEventListener('change', (event) => {
        currentAction = event.target.value;
    });

    setShortcutButton.addEventListener('click', () => {
        shortcutInput.focus();
    });

    shortcutInput.addEventListener('keydown', (event) => {
        event.preventDefault();
        const key = event.key;
        const modifierKeys = ['Control', 'Alt', 'Shift', 'Meta'];
        const pressedKeys = modifierKeys.filter(mod => event[`${mod.toLowerCase()}Key`]);
        if (!modifierKeys.includes(key)) {
            pressedKeys.push(key);
        }
        const shortcut = pressedKeys.join('+');
        shortcutInput.value = shortcut;

        if (reservedShortcuts.includes(shortcut)) {
            alert(`${shortcut} is a reserved shortcut and cannot be used.`);
            return;
        }

        if (currentAction && shortcut) {
            chrome.storage.sync.set({ [currentAction]: shortcut }, () => {
                updateShortcutsList();
            });
        }
    });

    function updateShortcutsList() {
        shortcutsList.innerHTML = '';
        chrome.storage.sync.get(null, (items) => {
            for (let action in items) {
                const li = document.createElement('li');
                li.textContent = `${action}: ${items[action]}`;
                shortcutsList.appendChild(li);
            }
        });
    }

    updateShortcutsList();
});
