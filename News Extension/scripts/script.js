document.addEventListener('DOMContentLoaded', () => {
  const apiKey = 'uk3-K-CYxB4dctaHp9yNrpn4mTQZpA1HOyV2Ngi_dhR6EU6s';
  const url = `https://api.currentsapi.services/v1/latest-news?apiKey=${apiKey}`;

  const fetchNews = async () => {
      try {
          const response = await fetch(url);
          const data = await response.json();
          if (data.status === "ok") {
              displayNews(data.news);
          } else {
              console.error("Error fetching news:", data.message);
          }
      } catch (error) {
          console.error("Error fetching news:", error);
      }
  };

  const displayNews = (articles) => {
      const newsContainer = document.getElementById('news-container');
      newsContainer.innerHTML = '';

      articles.forEach(article => {
          const newsItem = document.createElement('div');
          newsItem.className = 'news-item';

          const title = document.createElement('h2');
          title.textContent = article.title;

          const description = document.createElement('p');
          description.textContent = article.description;

          newsItem.appendChild(title);
          newsItem.appendChild(description);
          newsContainer.appendChild(newsItem);
      });
  };

  fetchNews();
});


