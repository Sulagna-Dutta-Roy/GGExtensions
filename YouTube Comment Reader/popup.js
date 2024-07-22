// Popup script
document.addEventListener('DOMContentLoaded', () => {
  const fetchCommentsBtn = document.getElementById('fetchComments');
  const commentsContainer = document.getElementById('comments');

  fetchCommentsBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage('getComments', (response) => {
      commentsContainer.innerHTML = response.map(comment => `<p>${comment}</p>`).join('');
    });
  });
});
