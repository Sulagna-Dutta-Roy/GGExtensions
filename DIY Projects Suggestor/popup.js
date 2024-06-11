document.getElementById('suggestBtn').addEventListener('click', async () => {
    const keyword = document.getElementById('keywordInput').value;
    const suggestionsOutput = document.getElementById('suggestionsOutput');
    suggestionsOutput.innerHTML = '';
  
    if (!keyword) {
      suggestionsOutput.innerHTML = 'Please enter a keyword.';
      return;
    }
  
    try {
      const youtubeSuggestions = await getYouTubeSuggestions(keyword);
      suggestionsOutput.innerHTML = '<h2>YouTube Videos</h2>';
      youtubeSuggestions.forEach(video => {
        const link = document.createElement('a');
        link.href = `https://www.youtube.com/watch?v=${video.id.videoId}`;
        link.classList.add('youtube-suggestion');
        link.textContent = video.snippet.title;
        link.target = '_blank';
        suggestionsOutput.appendChild(link);
        suggestionsOutput.appendChild(document.createElement('br'));
      });
    } catch (error) {
      suggestionsOutput.innerHTML = 'Error fetching suggestions. Please try again later.';
    }
  });
  
  async function getYouTubeSuggestions(keyword) {
    const apiKey = 'API_KEY';  // Replace with your YouTube Data API key
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=how+to+make+a+DIY+${keyword}&key=${apiKey}`);
    const data = await response.json();
    return data.items;
  }
  
  