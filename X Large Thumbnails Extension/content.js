// Content script to identify single-media posts
function identifyAndEnlargeThumbnails() {
  const singleMediaPosts = document.querySelectorAll('.tweet'); // Adjust selector to match Twitter's tweet container
  singleMediaPosts.forEach(post => {
    post.style.width = '100%'; // Adjust width to ensure full size
    post.style.height = 'auto'; // Maintain aspect ratio
  });
}

// Execute the function when the page is fully loaded
window.addEventListener('load', identifyAndEnlargeThumbnails);
