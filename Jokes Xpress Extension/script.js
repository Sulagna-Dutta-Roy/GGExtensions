document.addEventListener('DOMContentLoaded', () => {
    const jokeElement = document.getElementById("JokeElement");
    const nextJokeButton = document.getElementById("NextJokeButton");

    function fetchJoke() {
        fetch('https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Pun,Christmas?blacklistFlags=nsfw&type=single')
            .then(response => response.json())
            .then(jokedata => {
                jokeElement.innerHTML = jokedata.joke;
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                jokeElement.innerHTML = "Failed to fetch a joke.";
            });
    }

    // Fetch a joke when the page loads
    fetchJoke();

    // Fetch a new joke when the button is clicked
    nextJokeButton.addEventListener('click', fetchJoke);
});
