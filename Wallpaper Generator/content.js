// content.js
fetch('https://source.unsplash.com/random/1920x1080')
  .then(response => response.url)
  .then(url => {
    const extension = url.split('.').pop();
    const imageUrl = `<img src="${url}" alt="Random Wallpaper" style="max-width: 100%; height: auto;">`;
    document.getElementById('wallpaper').innerHTML = `
      <p>Extension: .${extension}</p>
      ${imageUrl}
    `;
  })
  .catch(error => console.error('Error fetching wallpaper:', error));
