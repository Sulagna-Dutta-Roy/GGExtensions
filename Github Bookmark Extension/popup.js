document.addEventListener('DOMContentLoaded', function () {
    var addBookmarkButton = document.getElementById('addBookmark');
    var githubUrlInput = document.getElementById('githubUrl');
    var statusMessage = document.getElementById('statusMessage');

    addBookmarkButton.addEventListener('click', function () {
        var url = githubUrlInput.value.trim();
        if (url === '') {
            setStatus('Please enter a GitHub URL.', 'red');
            return;
        }

        if (!isValidUrl(url)) {
            setStatus('Invalid GitHub URL.', 'red');
            return;
        }

        saveBookmark(url);
        setStatus('GitHub URL bookmarked successfully.', 'green');
        githubUrlInput.value = '';
    });

    function setStatus(message, color) {
        statusMessage.textContent = message;
        statusMessage.style.color = color;
    }

    function isValidUrl(url) {
        var regex = /^https?:\/\/github\.com\/.*$/;
        return regex.test(url);
    }

    function saveBookmark(url) {
        chrome.bookmarks.create({
            title: 'GitHub Bookmark',
            url: url
        }, function () {
            setStatus('GitHub URL bookmarked successfully.', 'green');
        });
    }
});
