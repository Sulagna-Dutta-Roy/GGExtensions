// background.js

// Listen for changes to bookmarks and update stored bookmarks
chrome.bookmarks.onCreated.addListener(updateStoredBookmarks);
chrome.bookmarks.onRemoved.addListener(updateStoredBookmarks);
chrome.bookmarks.onChanged.addListener(updateStoredBookmarks);

// Sync bookmarks across devices using Chrome Storage API
function syncBookmarks() {
  chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
    chrome.storage.sync.set({ 'bookmarks': bookmarkTreeNodes }, function() {
      console.log('Bookmarks synced successfully.');
    });
  });
}

// Update stored bookmarks when changes occur
function updateStoredBookmarks() {
  syncBookmarks();
}

// Initialize bookmark syncing on extension install or update
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install' || details.reason === 'update') {
    syncBookmarks();
  }
});
