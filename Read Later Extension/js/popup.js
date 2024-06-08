document.addEventListener('DOMContentLoaded', () => {
    // Save the current page functionality
    document.getElementById('save-article').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            chrome.storage.local.get({ articles: [] }, (result) => {
                const articles = result.articles;
                articles.push({ title: tab.title, url: tab.url, tags: [] });
                chrome.storage.local.set({ articles });
                displayArticles();
            });
        });
    });

    // Function to display articles
    function displayArticles() {
        chrome.storage.local.get({ articles: [] }, (result) => {
            const tbody = document.querySelector('#reading-list tbody');
            tbody.innerHTML = '';
            result.articles.forEach((article, index) => {
                if (!article.tags) {
                    article.tags = [];  // Ensure tags property is initialized
                }

                const row = document.createElement('tr');

                // Link column
                const linkCell = document.createElement('td');
                linkCell.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
                row.appendChild(linkCell);

                // Tags column
                const tagsCell = document.createElement('td');
                tagsCell.innerHTML = article.tags.join(', ');
                row.appendChild(tagsCell);

                // Add tag column
                const tagCell = document.createElement('td');
                const tagInput = document.createElement('input');
                tagInput.type = 'text';
                tagInput.placeholder = 'Add new tag';
                const tagButton = document.createElement('button');
                tagButton.textContent = 'Add';
                tagButton.addEventListener('click', () => {
                    addTag(index, tagInput.value);
                    tagInput.value = '';
                });
                tagCell.appendChild(tagInput);
                tagCell.appendChild(tagButton);
                row.appendChild(tagCell);

                // Remove column
                const removeCell = document.createElement('td');
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.addEventListener('click', () => {
                    removeArticle(index);
                });
                removeCell.appendChild(removeButton);
                row.appendChild(removeCell);

                tbody.appendChild(row);
            });
        });
    }

    // Function to add a tag to an article
    function addTag(index, tag) {
        if (tag) {
            chrome.storage.local.get({ articles: [] }, (result) => {
                const articles = result.articles;
                if (articles[index]) {
                    if (!articles[index].tags) {
                        articles[index].tags = [];  // Ensure tags property is initialized
                    }
                    if (!articles[index].tags.includes(tag)) {
                        articles[index].tags.push(tag);
                        chrome.storage.local.set({ articles }, displayArticles);
                    }
                }
            });
        }
    }

    // Function to remove an article
    function removeArticle(index) {
        chrome.storage.local.get({ articles: [] }, (result) => {
            const articles = result.articles;
            articles.splice(index, 1);
            chrome.storage.local.set({ articles }, displayArticles);
        });
    }

    // Initial display of articles
    displayArticles();
});
