// document.addEventListener('DOMContentLoaded', () => {
//     fetch('https://waifu.it/api/v4/quote', {
//         headers: {
//             'Authorization': 'YOUR-API-KEY' // Get API key from https://waifu.it/
//         }
//     })
//     .then(response => response.json())
//     .then(AnimeData => {
//         const quote = AnimeData.quote;
//         const anime = AnimeData.anime;
//         const author = AnimeData.author;

//         const quoteElement = document.getElementById('quote');
//         const animeElement = document.getElementById('anime');
//         const authorElement = document.getElementById('author');

//         quoteElement.innerHTML = `"${quote}"`;
//         animeElement.innerHTML = `Anime: ${anime}`;
//         authorElement.innerHTML = `Author: ${author}`;
//     })
//     .catch(error => console.error('Error fetching the Anime:', error));
// });

document.querySelector("button").addEventListener("click", () => {
    let inputval = document.querySelector("input").value.toLowerCase();

    fetch(`https://api.jikan.moe/v4/anime?q=${inputval}&limit=20`)
        .then(res => res.json())
        .then(data => {
            let resultsDiv = document.querySelector('.results');
            resultsDiv.innerHTML = ''; 

            let animeData = data.data;
            animeData.forEach(e => {
                let animeItem = document.createElement('div');
                animeItem.classList.add('anime-item');

                let animeLink = document.createElement('a');
                animeLink.href = e.url;
                animeLink.target = "_blank";

                let animeImage = document.createElement('img');
                animeImage.src = e.images.jpg.image_url;
                animeLink.appendChild(animeImage);

                animeItem.appendChild(animeLink);

                let animeTitle = document.createElement('h2');
                animeTitle.style.textAlign = 'center';
                animeTitle.textContent = e.title_english ? e.title_english : e.title;
                animeItem.appendChild(animeTitle);

                let moreInfoLink = document.createElement('a');
                moreInfoLink.href = e.url;
                moreInfoLink.textContent = "More Info";
                moreInfoLink.target = "_blank";
                animeItem.appendChild(moreInfoLink);

                resultsDiv.appendChild(animeItem);
            });
        })
        .catch(error => console.error('Error:', error));
});
