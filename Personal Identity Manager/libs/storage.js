function saveIdentity(identity, callback) {
    chrome.storage.sync.get(['identities'], (result) => {
        const identities = result.identities || [];
        identities.push({
            name: identity.name,
            email: encrypt(identity.email),
            password: encrypt(identity.password)
        });
        chrome.storage.sync.set({ identities }, callback);
    });
}

function getIdentities(callback) {
    chrome.storage.sync.get(['identities'], (result) => {
        const identities = result.identities.map(identity => ({
            name: identity.name,
            email: decrypt(identity.email),
            password: decrypt(identity.password)
        }));
        callback(identities);
    });
}