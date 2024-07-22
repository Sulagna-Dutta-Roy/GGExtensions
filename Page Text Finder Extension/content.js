let foundIndexes = [];
let currentFoundIndex = 0;
let isResizing = false;

let textStorage = '';
let outerDivSize = {};

chrome.storage.local.get(['outerDivWidth', 'outerDivHeight', 'textStorage'], (result) => {
	outerDivSize.width = result.outerDivWidth || '400';
	outerDivSize.height = result.outerDivHeight || '300';
	textStorage = result.textStorage || '';
});

chrome.runtime.onMessage.addListener((request) => {
	if (request.type === 'textStorageChanged') {
		chrome.storage.local.get(['textStorage'], (data) => {
			textStorage = data.textStorage;
		});
	}
});

document.addEventListener('mouseup', async () => {
	if (isResizing) return;
	clearExistingMessage();
	if (textStorage === '') return;
	await new Promise((resolve) => setTimeout(resolve, 0));

	let selectedText = window.getSelection().toString().trim();

	if (selectedText.length > 0) {
		foundIndexes = findAllInstances(textStorage, selectedText);
		currentFoundIndex = 0;
		showMessageOnPage(foundIndexes.length > 0, selectedText);
	}
});

const showMessageOnPage = (found, selectedText) => {
	clearExistingMessage();

	const outerDiv = document.createElement('div');
	outerDiv.id = '_outerDiv_';

	if (!found) {
		outerDiv.innerHTML = 'not found';
		outerDiv.style.minWidth = '0px';
		outerDiv.style.minHeight = '0px';
	} else {
		outerDiv.addEventListener('mouseup', (e) => {
			if (!isResizing) e.stopPropagation();
		});
		outerDiv.style.width = `${outerDivSize.width}px`;
		outerDiv.style.height = `${outerDivSize.height}px`;

		const resizeHandle = document.createElement('div');
		resizeHandle.id = '_resizeHandle_';
		resizeHandle.innerHTML = '\u21F1 ';

		let startX, startY, startWidth, startHeight;
		resizeHandle.addEventListener('mousedown', (e) => {
			e.stopPropagation();
			e.preventDefault();
			isResizing = true;
			startX = e.clientX;
			startY = e.clientY;
			startWidth = parseInt(document.defaultView.getComputedStyle(outerDiv).width, 10);
			startHeight = parseInt(document.defaultView.getComputedStyle(outerDiv).height, 10);
		});
		document.addEventListener('mousemove', (e) => {
			if (isResizing) {
				outerDivSize.width = startWidth - (e.clientX - startX);
				outerDivSize.height = startHeight - (e.clientY - startY);
				outerDiv.style.width = `${Math.max(outerDivSize.width, 100)}px`;
				outerDiv.style.height = `${Math.max(outerDivSize.height, 50)}px`;
			}
		});
		document.addEventListener('mouseup', (e) => {
			isResizing = false;
			chrome.storage.local.set({ outerDivWidth: outerDivSize.width, outerDivHeight: outerDivSize.height });
		});

		const optionsDiv = document.createElement('div');
		optionsDiv.id = '_optionsDiv_';

		const matchesText = document.createElement('span');
		matchesText.id = '_matchesText_';
		matchesText.innerHTML = `Matches: ${currentFoundIndex + 1}/${foundIndexes.length}`;

		const prevButton = document.createElement('button');
		prevButton.id = '_prevButton_';
		prevButton.innerHTML = 'Prev';
		prevButton.onmouseup = () => {
			if (currentFoundIndex > 0) {
				currentFoundIndex--;
				showMessageOnPage(true, selectedText);
			}
		};

		const nextButton = document.createElement('button');
		nextButton.id = '_nextButton_';
		nextButton.innerHTML = 'Next';
		nextButton.onmouseup = () => {
			if (currentFoundIndex < foundIndexes.length - 1) {
				currentFoundIndex++;
				showMessageOnPage(true, selectedText);
			}
		};

		const innerDiv = document.createElement('div');
		innerDiv.id = '_innerDiv_';
		innerDiv.innerHTML = wrapFindings(textStorage, selectedText, foundIndexes[currentFoundIndex]);

		outerDiv.appendChild(resizeHandle);
		optionsDiv.appendChild(prevButton);
		optionsDiv.appendChild(matchesText);
		optionsDiv.appendChild(nextButton);
		outerDiv.appendChild(innerDiv);
		outerDiv.appendChild(optionsDiv);
	}

	document.body.appendChild(outerDiv);
	if (found) {
		document.getElementById('_selectedTextExact_').scrollIntoView();
		document.getElementById('_innerDiv_').scrollTop -= 50;
		document.getElementById('_innerDiv_').scrollLeft = 0;
	}
};

// utils

const clearExistingMessage = () => {
	let existingMessage = document.getElementById('_outerDiv_');
	if (existingMessage) {
		existingMessage.parentNode.removeChild(existingMessage);
	}
};

const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

const findAllInstances = (source, target) => {
	let indexes = [];
	let i = source.indexOf(target);

	while (i !== -1) {
		indexes.push(i);
		i = source.indexOf(target, i + 1);
	}

	return indexes;
};

function wrapFindings(text, word, index) {
	const regex = new RegExp(`${escapeRegex(word)}`, 'g');
	let result = text.replace(regex, (match, offset) => {
		if (offset === index) {
			return `<span id="_selectedTextExact_">${match}</span>`;
		} else {
			return `<span id="_selectedTextNeighbors_">${match}</span>`;
		}
	});

	return result;
}
