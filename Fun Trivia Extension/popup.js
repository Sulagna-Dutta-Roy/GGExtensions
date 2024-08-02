document.addEventListener('DOMContentLoaded', function () {
    let loader=document.getElementById("preloader");
    window.addEventListener("load",function(){
     loader.style.display="none"})
    const triviaQuestions = [
        { question: "What is the capital of France?", answer: "Paris" },
        { question: "Which planet is known as the Red Planet?", answer: "Mars" },
        { question: "Who wrote the novel '1984'?", answer: "George Orwell" },
        { question: "What is the tallest mammal?", answer: "Giraffe" },
        { question: "What is the largest organ in the human body?", answer: "Skin" },
        { question: "Which country is commonly referred to as the 'Land of the Rising Sun'?", answer: "Japan" },
        { question: "What is the chemical symbol for water?", answer: "H2O" },
        { question: "Which artist painted the Mona Lisa?", answer: "Leonardo da Vinci" },
        { question: "What is the capital of Canada?", answer: "Ottawa" },
        { question: "What is the largest ocean on Earth?", answer: "Pacific Ocean" },
        { question: "What is the currency of Japan?", answer: "Yen" },
        { question: "Who is known as the father of modern physics?", answer: "Albert Einstein" },
        { question: "What is the chemical symbol for gold?", answer: "Au" },
        { question: "Which animal is known as the 'King of the Jungle'?", answer: "Lion" },
        { question: "What is the largest planet in our solar system?", answer: "Jupiter" },
        { question: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare" },
        { question: "What is the world's longest river?", answer: "Nile River" },
        { question: "What is the capital of Australia?", answer: "Canberra" },
        { question: "Which country is known as the 'Land of the Midnight Sun'?", answer: "Norway" },
        { question: "What is the chemical symbol for iron?", answer: "Fe" },
        { question: "What is the smallest country in the world?", answer: "Vatican City" },
        { question: "What is the main ingredient in guacamole?", answer: "Avocado" },
        { question: "What is the only planet in the solar system that rotates on its side?", answer: "Uranus" },
        { question: "Who discovered penicillin?", answer: "Alexander Fleming" },
        { question: "What is the highest mountain in the world?", answer: "Mount Everest" }
        // Add more trivia questions here
    ];

    let usedQuestions = []; // Track used questions
    let score = 0;
    const winCondition = 5;

    function getRandomTrivia() {
        // Filter out used questions
        const availableQuestions = triviaQuestions.filter(question => !usedQuestions.includes(question));
        if (availableQuestions.length === 0) {
            // If all questions have been used, reset usedQuestions array
            usedQuestions = [];
        }
        // Choose a random question from available questions
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const randomQuestion = availableQuestions[randomIndex];
        // Add the chosen question to usedQuestions array
        usedQuestions.push(randomQuestion);
        return randomQuestion;
    }

    function displayTriviaQuestion() {
        const triviaContainer = document.getElementById('trivia-question');
        const randomTrivia = getRandomTrivia();
        triviaContainer.textContent = randomTrivia.question;
        triviaContainer.dataset.answer = randomTrivia.answer.toLowerCase(); // Store the answer as a data attribute
    }

    function checkAnswer() {
        const userAnswer = document.getElementById('answer-input').value.trim().toLowerCase();
        const correctAnswer = document.getElementById('trivia-question').dataset.answer;
        const feedbackContainer = document.getElementById('feedback');
        if (userAnswer === correctAnswer) {
            score++;
            document.getElementById('score').textContent = `Score: ${score}`;
            feedbackContainer.textContent = "Correct answer! 🎉";
            if (score === winCondition) {
                openModal();
            }
        } else {
            feedbackContainer.innerHTML = `Incorrect answer. Try again!<br> The correct answer was: ${correctAnswer}`;
        }
        // Change question after answer is checked
        setTimeout(() => {
            if (score !== winCondition) {
                feedbackContainer.textContent = "";
                displayTriviaQuestion();
                document.getElementById('answer-input').value = ""; // Clear input field
            }
        }, 2500); // Delay for 2.5 seconds before changing question
    }

    function resetGame() {
        closeModal();
        score = 0;
        document.getElementById('score').textContent = `Score: ${score}`;
        usedQuestions = [];
        displayTriviaQuestion();
        document.getElementById('submit-answer-btn').disabled = false;
    }

    function openModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'block';
    }

    function closeModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
    }

    document.getElementById('submit-answer-btn').addEventListener('click', checkAnswer);
    document.getElementById('play-again-btn').addEventListener('click', resetGame);
    document.getElementById('play-again-modal-btn').addEventListener('click', resetGame);

    // Close the modal when the user clicks outside of it
    window.onclick = function (event) {
        const modal = document.getElementById('modal');
        if (event.target == modal) {
            closeModal();
        }
    }

    // Display a random trivia question when the page loads
    displayTriviaQuestion();
});