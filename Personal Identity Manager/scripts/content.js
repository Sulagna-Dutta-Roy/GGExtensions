chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'fillForm') {
        const identity = message.identity;
        document.querySelector('input[name="email"]').value = identity.email;
        document.querySelector('input[name="password"]').value = identity.password;
    }
});