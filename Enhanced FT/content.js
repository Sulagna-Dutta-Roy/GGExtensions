document.addEventListener('DOMContentLoaded', () => {
  // Hide original FT save button
  const originalSaveButton = document.querySelector('.original-save-button-class');
  if (originalSaveButton) {
    originalSaveButton.style.display = 'none';
  }

  // Create and add enhanced save button
  const enhancedSaveButton = document.createElement('button');
  enhancedSaveButton.innerText = 'Enhanced Save';
  enhancedSaveButton.id = 'enhanced-save-button';
  enhancedSaveButton.onclick = () => {
    const article = {
      title: document.querySelector('h1').innerText,
      content: document.querySelector('.article-content-class').innerText,
      url: window.location.href
    };
    saveArticle(article);
  };

  const header = document.querySelector('.header-class');
  if (header) {
    header.appendChild(enhancedSaveButton);
  }
});

function saveArticle(article) {
  chrome.storage.local.get({ articles: [] }, (result) => {
    const articles = result.articles;
    articles.push(article);
    chrome.storage.local.set({ articles }, () => {
      console.log('Article saved');
    });
  });
}
