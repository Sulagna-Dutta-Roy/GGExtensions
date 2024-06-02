document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', function (event) {
        const query = event.target.value.trim();
        if (query) {
            searchSongs(query);
        }
    });

    document.getElementById('searchButton').addEventListener('click', function () {
        const query = searchInput.value.trim();
        if (query) {
            searchSongs(query);
        }
    });
});

async function searchSongs(query) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = 'Searching...';

    try {
        const apiKey = '38f33d8bc856fb16552198e85570738a'; // Replace with your Last.fm API key
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(query)}&api_key=${apiKey}&format=json`);
        const data = await response.json();
        displayResults(data.results.trackmatches.track);
    } catch (error) {
        resultsDiv.innerHTML = 'Error fetching results';
    }
}

function displayResults(songs) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    songs.forEach(song => {
        const songDiv = document.createElement('div');
        songDiv.className = 'song';
        songDiv.innerHTML = `
        <strong>${song.name}</strong> by ${song.artist} 
        <a href="${getSpotifyLink(song.name, song.artist)}" target="_blank">Listen on Spotify</a> | 
        <a href="${getAppleMusicLink(song.name, song.artist)}" target="_blank">Listen on Apple Music</a>
      `;
        resultsDiv.appendChild(songDiv);
    });
}

function getSpotifyLink(track, artist) {
    // Use your own logic or API to generate Spotify links
    return `https://open.spotify.com/search/${encodeURIComponent(track)}%20artist:${encodeURIComponent(artist)}`;
}

function getAppleMusicLink(track, artist) {
    // Use your own logic or API to generate Apple Music links
    return `https://music.apple.com/search?term=${encodeURIComponent(track)}%20${encodeURIComponent(artist)}`;
}
