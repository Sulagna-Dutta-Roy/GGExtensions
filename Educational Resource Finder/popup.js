document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("search-button").addEventListener("click", () => {
    const query = document.getElementById("search-query").value;
    if (query) {
      fetchResources(query);
    }
  });
});

function fetchResources(query) {
  fetchWikipediaArticles(query).then((articles) => {
    displayResources("article-list", articles);
  });
  fetchDuckDuckGoVideos(query).then((videos) => {
    displayResources("video-list", videos);
  });
}

function displayResources(listId, resources) {
  const list = document.getElementById(listId);
  list.innerHTML = "";
  resources.forEach((resource) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = resource.url;
    link.textContent = resource.title;
    link.target = "_blank";
    listItem.appendChild(link);
    list.appendChild(listItem);
  });
}

async function fetchWikipediaArticles(query) {
  const response = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      query
    )}&format=json&origin=*`
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
    `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`
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
