document.getElementById('saveSnippet').addEventListener('click', () => {
    const title = document.getElementById('snippetTitle').value;
    const tags = document.getElementById('snippetTags').value;
    const content = document.getElementById('snippetContent').value;

    if (title && content) {
        chrome.storage.sync.get(['snippets'], (result) => {
            const snippets = result.snippets || [];
            snippets.push({ title, tags, content });
            chrome.storage.sync.set({ snippets: snippets }, () => {
                displaySnippets();
            });
        });
    }
});

document.getElementById('importSnippets').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const importedSnippets = JSON.parse(e.target.result);
        chrome.storage.sync.get(['snippets'], (result) => {
            const snippets = result.snippets || [];
            importedSnippets.forEach(snippet => snippets.push(snippet));
            chrome.storage.sync.set({ snippets: snippets }, () => {
                displaySnippets();
            });
        });
    };

    reader.readAsText(file);
});

function displaySnippets() {
    chrome.storage.sync.get(['snippets'], (result) => {
        const snippets = result.snippets || [];
        const snippetsList = document.getElementById('snippetsList');
        snippetsList.innerHTML = '';
        snippets.forEach((snippet, index) => {
            const snippetElement = document.createElement('div');
            snippetElement.innerHTML = `<strong>${snippet.title}</strong><br>${snippet.content}<br><em>Tags: ${snippet.tags}</em>`;
            snippetsList.appendChild(snippetElement);
        });
    });
}

document.addEventListener('DOMContentLoaded', displaySnippets);