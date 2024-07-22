chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: "getPageContent" }, (response) => {
    if (response && response.content) {
      fetchResources(response.content);
    }
  });
});

function fetchResources(content) {
  const query = encodeURIComponent(content);
  fetchWikipediaArticles(query).then((articles) => {
    chrome.storage.local.set({ articles });
  });
  fetchDuckDuckGoVideos(query).then((videos) => {
    chrome.storage.local.set({ videos });
  });
}

async function fetchWikipediaArticles(query) {
  const response = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`
  );
  const data = await response.json();
  const articles = data.query.search.slice(0, 5).map((item) => ({
    title: item.title,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
  }));
  return articles;
}

async function fetchDuckDuckGoVideos(query) {
  const response = await fetch(
    `https://duckduckgo.com/?q=${query}&format=json`
  );
  const data = await response.json();
  const videos = data.RelatedTopics.slice(0, 5)
    .filter((item) => item.FirstURL && item.Text)
    .map((item) => ({
      title: item.Text,
      url: item.FirstURL,
    }));
  return videos;
}
