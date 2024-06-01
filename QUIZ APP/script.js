const apiKey = '92naQKujHCuPsHmEkDtyaxsXD25ZUkS7lxoqXVGz';
const apiUrl = 'https://quizapi.io/api/v1/questions';

const difficultySelect = document.getElementById('difficulty');
const startBtn = document.getElementById('start-btn');
const quizContainer = document.getElementById('quiz-container');
const questionContainer = document.getElementById('question-container');
const nextBtn = document.getElementById('next-btn');
const scorecard = document.getElementById('scorecard');

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', showNextQuestion);
quizContainer.addEventListener('change', handleAnswerSelection);

async function startQuiz() {
    const difficulty = difficultySelect.value;
    const url = `${apiUrl}?apiKey=${apiKey}&category=code&difficulty=${difficulty}&limit=10`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch questions');
        }
        questions = await response.json();
        currentQuestionIndex = 0;
        score = 0;

        quizContainer.classList.remove('hidden');
        scorecard.classList.add('hidden');
        startBtn.classList.add('hidden');

        showQuestion(questions[currentQuestionIndex]);
    } catch (error) {
        console.error('Error starting quiz:', error);
    }
}

function showQuestion(question) {
    questionContainer.innerHTML = `
        <div class="question">${question.question}</div>
        ${Object.entries(question.answers)
            .filter(([key, value]) => value) // Filter out empty options
            .map(([key, value]) => `
                <div class="answer">
                    <input type="radio" name="answer" value="${key}" id="${key}">
                    <label for="${key}">${value}</label>
                </div>
            `)
            .join('')
        }
    `;
    nextBtn.classList.remove('hidden');
    nextBtn.disabled = true;
}


function showNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
    } else {
        showScorecard();
    }
}

function showScorecard() {
    quizContainer.classList.add('hidden');
    scorecard.classList.remove('hidden');
    scorecard.textContent = `Your score is ${score} out of ${questions.length}`;
}
function handleAnswerSelection(event) {
    if (event.target.name === 'answer') {
        const selectedAnswer = event.target.value;
        const correctAnswer = Object.keys(questions[currentQuestionIndex].correct_answers).find(key => questions[currentQuestionIndex].correct_answers[key] === 'true');

        if (selectedAnswer === correctAnswer) {
            score++;
        }
        nextBtn.disabled = false;
    }
}
