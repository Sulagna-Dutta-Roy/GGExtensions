// background.js
chrome.commands.onCommand.addListener((command) => {
    chrome.storage.sync.get(command, (items) => {
        if (items[command]) {
            console.log(`Shortcut for ${command}: ${items[command]}`);
            // Perform the action associated with the command here
        }
    });
});
