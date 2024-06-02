// document.getElementById('searchButton').addEventListener('click', function () {
//     const query = document.getElementById('searchInput').value;
//     if (query) {
//         searchSongs(query);
//     }
// });

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
        const response = await fetch(`https://api.lyrics.ovh/suggest/${query}`);
        const data = await response.json();
        displayResults(data.data);
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
        <strong>${song.title}</strong> by ${song.artist.name} | <a href="${song.spotifyLink}" target="_blank">Listen on Spotify</a> | 
        <a href="${song.youtubeLink}" target="_blank">Watch on YouTube</a>
      `;
        resultsDiv.appendChild(songDiv);
    });
}
