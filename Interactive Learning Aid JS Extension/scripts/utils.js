const saveToStorage = (key, value) => {
    chrome.storage.local.get([key], (result) => {
        const items = result[key] ? result[key] : [];
        items.push(value);
        chrome.storage.local.set({ [key]: items });
    });
};

const loadFromStorage = (key, callback) => {
    chrome.storage.local.get([key], (result) => {
        callback(result[key] || []);
    });
};

const updateProgress = (subject, progress) => {
    chrome.storage.local.get(['progress'], (result) => {
        const progressList = result.progress || [];
        const index = progressList.findIndex(item => item.subject === subject);
        if (index !== -1) {
            progressList[index].progress = progress;
        } else {
            progressList.push({ subject, progress });
        }
        chrome.storage.local.set({ progress: progressList });
    });
};