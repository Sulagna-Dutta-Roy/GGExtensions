const feeds = document.querySelectorAll('link[type="application/rss+xml"], link[type="application/atom+xml"]');
if (feeds.length > 0) {
  let feedUrls = [];
  feeds.forEach(feed => feedUrls.push(feed.href));
  chrome.storage.sync.set({feeds: feedUrls}, () => {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'images/icon48.png',
      title: 'RSS Finder',
      message: 'RSS feeds found on this page.',
      buttons: [{title: 'View Feeds'}],
      priority: 0
    });
  });
} else {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'images/icon48.png',
    title: 'RSS Finder',
    message: 'No RSS feeds found on this page.',
    priority: 0
  });
}
