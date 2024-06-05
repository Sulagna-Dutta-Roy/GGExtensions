document.addEventListener('DOMContentLoaded', function () {
    fetchDailyContent();

    document.getElementById('settings-btn').addEventListener('click', function () {
        console.log('click');
        document.getElementById('settings').classList.toggle('hidden');
        // document.getElementById('settings').classList.remove('hidden');
        // document.getElementById('settings').classList.add('saw');
    });

    document.getElementById('save-settings').addEventListener('click', function () {

        // document.getElementById('settings').classList.remove('saw');
        // document.getElementById('settings').classList.add('hidden');
        saveSettings();
    });
});

async function fetchDailyContent() {
    fetchFunFact();
    fetchJoke();
    fetchWordOfTheDay();
    fetchTriviaQuiz();
}

async function fetchFunFact() {
    // Fetch fun fact API or use pre-defined fun facts
    // Display fun fact in #fun-fact container
    const funFactContainer = document.getElementById('fun-fact');
    funFactContainer.textContent = 'Fetching from server, please wait...';

    try {
        const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
        const data = await response.json();
        funFactContainer.innerHTML = `<h3>Fun Fact </h3>` + `${data.text}`;
    } catch (error) {
        console.log('Error fetching fun fact:', error);
        funFactContainer.textContent = 'Failed to fetch fun fact. Please try again later.';
    }
}

async function fetchJoke() {
    // Fetch joke API or use pre-defined jokes
    // Display joke in #joke container
    const jokeContainer = document.getElementById('joke');
    jokeContainer.textContent = 'Fetching from server, please wait...';

    try {
        const response = await fetch('https://api.chucknorris.io/jokes/random');
        const data = await response.json();
        jokeContainer.innerHTML = `<h3>Joke of Day</h3>   ${data.value}`; // Assuming the API returns a 'value' field for the joke
    } catch (error) {
        console.log('Error fetching joke:', error);
        jokeContainer.textContent = 'Failed to fetch joke. Please try again later.';
    }
}

async function fetchWordOfTheDay() {
    // Fetch word of the day API or use pre-defined words
    // Display word of the day in #word-of-the-day container
    const wordContainer = document.getElementById('word-of-the-day');
    wordContainer.textContent = 'Fetching from server, please wait...';

    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word');
        const data = await response.json();
        const word = data[0];
        wordContainer.innerHTML = `<h3>Word of the Day</h3> ${word}`;
    } catch (error) {
        console.log('Error fetching word of the day:', error);
        wordContainer.textContent = 'Failed to fetch word of the day. Please try again later.';
    }
}

async function fetchTriviaQuiz() {
    // Fetch trivia quiz questions and answers
    // Display quiz in #trivia-quiz container
    const quizContainer = document.getElementById('trivia-quiz');
    quizContainer.textContent = 'Fetching from server, please wait...';

    try {
        const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
        const data = await response.json();
        const question = data.results[0].question;
        const answers = data.results[0].incorrect_answers.concat(data.results[0].correct_answer);
        const quizHtml = `
            <div>
                <p>${question}</p>
                <ul>
                    ${answers.map(answer => `<li>${answer}</li>`).join('')}
                </ul>
            </div>
        `;
        quizContainer.innerHTML = quizHtml;
    } catch (error) {
        console.log('Error fetching trivia quiz:', error);
        quizContainer.textContent = 'Failed to fetch trivia quiz. Please try again later.';
    }
}

async function saveSettings() {
    const selectedContent = document.querySelectorAll('input[name="content-type"]:checked');
    const contentTypes = Array.from(selectedContent).map(input => input.value);

    localStorage.setItem('contentTypes', JSON.stringify(contentTypes));

    updateContent();
}

async function updateContent() {
    const savedContentTypes = JSON.parse(localStorage.getItem('contentTypes'));

    if (savedContentTypes.includes('fun-fact')) {
        fetchFunFact();
    }
    if (savedContentTypes.includes('joke')) {
        fetchJoke();
    }
    if (savedContentTypes.includes('word-of-the-day')) {
        fetchWordOfTheDay();
    }
    if (savedContentTypes.includes('trivia-quiz')) {
        fetchTriviaQuiz();
    }
}
