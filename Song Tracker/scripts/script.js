let term = '';
let previousTerm = '';

const updateTerm = () => {
    term = document.getElementById('searchTerm').value.trim();
    
    // Avoid unnecessary API calls if the search term remains the same
    if (!term || term === '' || term === previousTerm) {
        return;
    }
    
    previousTerm = term;
    
    const url = `https://itunes.apple.com/search?term=${term}`; //API
    const songContainer = document.getElementById('songs');
    songContainer.innerHTML = ''; // Clear previous search results
    
    // Display loading state
    songContainer.innerHTML = '<p>Loading...</p>';
    
    fetch(url)
        .then((Response) => Response.json())
        .then((data) => {
            const artists = data.results;
            
            // Check if there are no results
            if (artists.length === 0) {
                songContainer.innerHTML = '<p>No results found.</p>';
                return;
            }
            
            // Create HTML elements and populate them with data
            artists.forEach(result => {
                const article = createSongElement(result);
                songContainer.appendChild(article);
            });
        })
        .catch(error => {
            // Display error message
            songContainer.innerHTML = `<p>Error: ${error.message}</p>`;
            console.error('Request failed:', error);
        });
};

const createSongElement = (result) => {
    const article = document.createElement('article');
    article.classList.add('song-item');
    
    const artists = document.createElement('p');
    artists.textContent = result.artistName;
    
    const song = document.createElement('h4');
    song.textContent = result.trackName;
    // Add play/pause functionality
    song.addEventListener('click', () => togglePlay(result.previewUrl));
    
    const img = document.createElement('img');
    img.src = result.artworkUrl100;
    
    const audio = document.createElement('audio');
    const audioSource = document.createElement('source');
    audioSource.src = result.previewUrl;
    audio.appendChild(audioSource);
    audio.controls = true;
    
    article.appendChild(img);
    article.appendChild(artists);
    article.appendChild(song);
    article.appendChild(audio);
    
    return article;
};

const togglePlay = (audioUrl) => {
    const audio = new Audio(audioUrl);
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
};

// Initialize search button event listener
const searchBtn = document.getElementById('searchTermBtn');
searchBtn.addEventListener('click', updateTerm);