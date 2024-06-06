document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get('feeds', (data) => {
      const feedList = document.getElementById('feedList');
      if (data.feeds) {
        data.feeds.forEach(feed => {
          const div = document.createElement('div');
          div.className = 'feed-item';
          const a = document.createElement('a');
          a.href = feed;
          a.textContent = feed;
          a.target = '_blank';
          div.appendChild(a);
          feedList.appendChild(div);
        });
      } else {
        feedList.textContent = 'No feeds found.';
      }
    });
  });
  