// Content script to extract comments
function extractComments() {
  const comments = document.querySelectorAll('#comments #content-text');
  const commentTexts = Array.from(comments).map(comment => comment.innerText);
  return commentTexts;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'getComments') {
    const comments = extractComments();
    sendResponse(comments);
  }
});
