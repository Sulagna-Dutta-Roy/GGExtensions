const saveButton = document.getElementById('saveButton');
const clearButton = document.getElementById('clearButton');
const textBox = document.getElementById('textStorageBox');

const signalTextStorageChanged = () => {
	chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] }, (tabs) => {
		tabs.forEach((tab) => {
			chrome.tabs.sendMessage(tab.id, {
				type: 'textStorageChanged',
			});
		});
	});
};

chrome.storage.local.get(['textStorage'], (data) => {
	textBox.innerHTML = data.textStorage || '';
});

saveButton.addEventListener('click', () => {
	chrome.storage.local.set({ textStorage: textBox.innerHTML });
	signalTextStorageChanged();
});

clearButton.addEventListener('click', () => {
	textBox.innerHTML = '';
	chrome.storage.local.set({ textStorage: '' });
	signalTextStorageChanged();
});
