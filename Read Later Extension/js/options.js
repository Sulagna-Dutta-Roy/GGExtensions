document.addEventListener('DOMContentLoaded', () => {
    // Event listener for adding a new tag
    document.getElementById('add-tag').addEventListener('click', () => {
        const newTag = document.getElementById('new-tag').value;
        if (newTag) {
            chrome.storage.local.get({ tags: [] }, (result) => {
                const tags = result.tags;
                tags.push(newTag);
                chrome.storage.local.set({ tags }, displayTags);
            });
        }
    });

    // Function to display tags
    function displayTags() {
        chrome.storage.local.get({ tags: [] }, (result) => {
            const list = document.getElementById('tags-list');
            list.innerHTML = '';
            result.tags.forEach((tag, index) => {
                const tagItem = document.createElement('li');
                tagItem.innerHTML = `
                    ${tag}
                    <button class="remove-tag" data-index="${index}">Remove</button>
                `;
                list.appendChild(tagItem);
            });

            document.querySelectorAll('.remove-tag').forEach(button => {
                button.addEventListener('click', (event) => {
                    const index = event.target.getAttribute('data-index');
                    removeTag(index);
                });
            });
        });
    }

    // Function to remove a tag
    function removeTag(index) {
        chrome.storage.local.get({ tags: [] }, (result) => {
            const tags = result.tags;
            tags.splice(index, 1);
            chrome.storage.local.set({ tags }, displayTags);
        });
    }

    // Initial display of tags
    displayTags();
});
