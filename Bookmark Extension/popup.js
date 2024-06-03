document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('addBookmark').addEventListener('click', function () {
    var url = document.getElementById('bookmarkUrl').value;
    var tags = document.getElementById('bookmarkTags').value.split(',').map(tag => tag.trim());

    chrome.bookmarks.create({ 'title': url, 'url': url }, function (newBookmark) {
      chrome.storage.sync.get('bookmarks', function (result) {
        var bookmarks = result.bookmarks || [];
        bookmarks.push({ id: newBookmark.id, url: url, tags: tags });
        chrome.storage.sync.set({ 'bookmarks': bookmarks }, function () {
          document.getElementById('status').textContent = 'Bookmark added successfully.';
        });
      });
    });
  });
});
