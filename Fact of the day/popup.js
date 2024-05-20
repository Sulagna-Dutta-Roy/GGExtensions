document.addEventListener('DOMContentLoaded', function() {
    getFactOfTheDay();

    document.getElementById('refresh-btn').addEventListener('click', function() {
        getFactOfTheDay();
    });
});

function getFactOfTheDay() {
    fetch('https://uselessfacts.jsph.pl/random.json?language=en')
    .then(response => response.json())
    .then(data => {
        document.getElementById('fact-text').innerText = data.text;
    })
    .catch(error => {
        console.error('Error fetching fact:', error);
        document.getElementById('fact-text').innerText = 'Failed to fetch fact. Please try again later.';
    });
}
