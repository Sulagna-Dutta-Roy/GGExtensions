document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'DEMO_KEY';  // Replace with your NASA API key
    const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
  
    fetch(apiURL)
      .then(response => response.json())
      .then(data => {
        document.getElementById('apod-image').src = data.url;
        document.getElementById('title').textContent = data.title;
        document.getElementById('description').textContent = data.explanation;
      })
      .catch(error => console.error('Error fetching the APOD:', error));
  });
  