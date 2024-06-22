document.addEventListener('DOMContentLoaded', () => {
  const articlesList = document.getElementById('articles');
  chrome.storage.local.get({ articles: [] }, (result) => {
    const articles = result.articles;
    articles.forEach((article, index) => {
      const li = document.createElement('li');
      li.className = 'article';
      li.innerHTML = `<strong>${article.title}</strong><br><a href="${article.url}" target="_blank">Read</a>`;
      articlesList.appendChild(li);
    });
  });
});
