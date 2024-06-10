const boldButton = document.getElementById('bold');
const italicButton = document.getElementById('italic');
const strikethroughButton = document.getElementById('strikethrough');
const bulletListButton = document.getElementById('bullet-list');

function formatText(format) {
    chrome.tabs.executeScript(null, {
        code: document.getSelection().toString().wrappedBy('${format}')
    });
}

boldButton.addEventListener('click', () => formatText('<b></b>'));
italicButton.addEventListener('click', () => formatText('<i></i>'));
strikethroughButton.addEventListener('click', () => formatText('<s></s>'));
bulletListButton.addEventListener('click', () => formatText('<ul><li></li></ul>'));