document.addEventListener('DOMContentLoaded', async function () {
    const API_URL = 'https://api.artic.edu/api/v1/artworks';
    const artworkImage = document.getElementById('artwork-image');
    const artworkTitle = document.getElementById('artwork-title');
    const artworkArtist = document.getElementById('artwork-artist');
    const artworkDescription = document.getElementById('artwork-description');
    const nextButton = document.getElementById('next-button');

    async function fetchAndDisplayArtwork() {
        try {
            const response = await fetch(`${API_URL}?limit=100`);
            const data = await response.json();
            const artworks = data.data;
            const randomArtwork = artworks[Math.floor(Math.random() * artworks.length)];

            const imageUrl = `https://www.artic.edu/iiif/2/${randomArtwork.image_id}/full/300,/0/default.jpg`; // Lower resolution

            const image = new Image();
            image.src = imageUrl;

            image.onload = function() {
                artworkImage.src = imageUrl;
                artworkTitle.textContent = randomArtwork.title;
                artworkArtist.textContent = randomArtwork.artist_display;
                artworkDescription.textContent = randomArtwork.thumbnail?.alt_text || 'No description available';
            };

        } catch (error) {
            console.error('Error fetching artwork data:', error);
            artworkImage.src = 'error.jpg';
            artworkTitle.textContent = 'Error';
            artworkArtist.textContent = '';
            artworkDescription.textContent = 'Failed to load artwork. Please try again later.';
        }
    }

    fetchAndDisplayArtwork();

    nextButton.addEventListener('click', fetchAndDisplayArtwork);
});
