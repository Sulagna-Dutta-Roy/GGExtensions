let term = '';
let previousTerm = '';
let debounceTimer;

const updateTerm = () => {
    const searchTerm = document.getElementById('searchTerm').value.trim();
    
    // Avoid unnecessary API calls if the search term remains the same
    if (!searchTerm || searchTerm === '' || searchTerm === previousTerm) {
        return;
    }
    
    previousTerm = searchTerm;
    term = searchTerm;
    
    // Debounce input to avoid frequent API calls
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        fetchData(term);
    }, 300); // Adjust debounce delay as needed
};

const fetchData = (term) => {
    const url = `https://itunes.apple.com/search?term=${term}`; //API
    const songContainer = document.getElementById('songs');
    songContainer.innerHTML = ''; // Clear previous search results
    
    // Display loading state
    songContainer.innerHTML = '<p>Loading...</p>';
    
    fetch(url)
        .then((Response) => Response.json())
        .then((data) => {
            displayResults(data.results, songContainer);
        })
        .catch(error => {
            // Display error message
            songContainer.innerHTML = `<p>Error: ${error.message}</p>`;
            console.error('Request failed:', error);
        });
};

const displayResults = (results, container) => {
    if (results.length === 0) {
        container.innerHTML = '<p>No results found.</p>';
        return;
    }
    
    const fragment = document.createDocumentFragment();
    
    results.forEach(result => {
        const article = createSongElement(result);
        fragment.appendChild(article);
    });
    
    container.innerHTML = '';
    container.appendChild(fragment);
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
