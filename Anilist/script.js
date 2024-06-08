document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('searchInput');
  const animeResults = document.getElementById('animeResults');

  searchButton.addEventListener('click', function() {
      const query = searchInput.value;
      if (query) {
          searchAnime(query);
      }
  });

  searchInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
          const query = searchInput.value;
          if (query) {
              searchAnime(query);
          }
      }
  });

  async function searchAnime(query) {
      const url = 'https://graphql.anilist.co';
      const options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify({
              query: `
                  query ($search: String) {
                      Media(search: $search, type: ANIME) {
                          id
                          title {
                              romaji
                              english
                              native
                          }
                          description
                          episodes
                          status
                          coverImage {
                              large
                          }
                      }
                  }
              `,
              variables: {
                  search: query
              }
          })
      };

      try {
          const response = await fetch(url, options);
          const data = await response.json();
          if (data.data && data.data.Media) {
              displayResults(data);
          } else {
              displayError('No results found for your search. Try another name');
          }
      } catch (error) {
          displayError('An error occurred while fetching data.');
      }
  }

  function displayResults(data) {
      const anime = data.data.Media;
      const formattedDescription = anime.description
          .replace(/<br>/g, '<br>')
          .replace(/\n/g, '<br>');
      animeResults.innerHTML = `
          <div>
              <h2>${anime.title.english || anime.title.romaji}</h2>
              <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
              <p>${formattedDescription}</p>
              <p><strong>Episodes:</strong> ${anime.episodes}</p>
              <p><strong>Status:</strong> ${anime.status}</p>
          </div>
      `;
  }

  function displayError(message) {
      animeResults.innerHTML = `<p>${message}</p>`;
  }
});
