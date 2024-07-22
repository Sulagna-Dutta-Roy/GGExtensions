document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var currentUrl = tabs[0].url;
    fetchRedditThreads(currentUrl);
  });
});

function fetchRedditThreads(url) {
  // Use Reddit API to find submission threads related to the current URL
  // Example API request: https://www.reddit.com/search.json?q=url:example.com
  // Replace 'example.com' with the current URL
  // Process the JSON response and populate the popup with relevant threads
}
