
    document.addEventListener('DOMContentLoaded', () => {
        const jokeElement = document.getElementById("jokeElement");
        const nextJokeButton = document.getElementById("NextJokeButton");
        function fetchJoke() {
        fetch('https://icanhazdadjoke.com/slack')
            .then(data => data.json())
            .then(jokedata => {
                jokeElement.innerHTML = jokedata.attachments[0].text;;
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