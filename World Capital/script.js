const questions = [
    {
        question: "What is the capital of France?",
        answers: [
            {text: "Paris", correct: true},
            {text: "Rome", correct: false},
            {text: "Madrid", correct: false},
            {text: "Berlin", correct: false},
        ]
    },
    {
        question: "What is the capital of Japan?",
        answers: [
            {text: "Tokyo", correct: true},
            {text: "Seoul", correct: false},
            {text: "Bangkok", correct: false},
            {text: "Beijing", correct: false},
        ]
    },
    {
        question: "What is the capital of Canada?",
        answers: [
            {text: "Toronto", correct: false},
            {text: "Ottawa", correct: true},
            {text: "Vancouver", correct: false},
            {text: "Montreal", correct: false},
        ]
    },
    {
        question: "What is the capital of Australia?",
        answers: [
            {text: "Canberra", correct: true},
            {text: "Sydney", correct: false},
            {text: "Melbourne", correct: false},
            {text: "Brisbane", correct: false},
        ]
    },
    {
        question: "What is the capital of Brazil?",
        answers: [
            {text: "São Paulo", correct: false},
            {text: "Brasília", correct: true},
            {text: "Rio de Janeiro", correct: false},
            {text: "Salvador", correct: false},
        ]
    },
    {
        question: "What is the capital of Germany?",
        answers: [
            {text: "Berlin", correct: true},
            {text: "Munich", correct: false},
            {text: "Frankfurt", correct: false},
            {text: "Hamburg", correct: false},
        ]
    },
    {
        question: "What is the capital of Russia?",
        answers: [
            {text: "Saint Petersburg", correct: false},
            {text: "Kiev", correct: false},
            {text: "Moscow", correct: true},
            {text: "Minsk", correct: false},
        ]
    },
    {
        question: "What is the capital of India?",
        answers: [
            {text: "New Delhi", correct: true},
            {text: "Mumbai", correct: false},
            {text: "Gujrat", correct: false},
            {text: "Kolkata", correct: false},
        ]
    },
    {
        question: "What is the capital of Italy?",
        answers: [
            {text: "Venice", correct: false},
            {text: "Rome", correct: true},
            {text: "Milan", correct: false},
            {text: "Florence", correct: false},
        ]
    },
    {
        question: "What is the capital of South Africa?",
        answers: [
            {text: "Pretoria", correct: true},
            {text: "Cape Town", correct: false},
            {text: "Johannesburg", correct: false},
            {text: "Durban", correct: false},
        ]
    },
    {
        question: "What is the capital of China",
        answers: [
            {text: "Shanghai", correct: false},
            {text: "Beijing", correct: true},
            {text: "Guangzhou", correct: false},
            {text: "Shenzhen", correct: false},
        ]
    },
    {
        question: "What is the capital of Egypt?",
        answers: [
            {text: "Cairo", correct: true},
            {text: "Alexandria", correct: false},
            {text: "Giza", correct: false},
            {text: "Luxor", correct: false},
        ]
    },
    {
        question: "What is the capital of Argentina?",
        answers: [
            {text: "Buenos Aires", correct: true},
            {text: "Cordoba", correct: false},
            {text: "Rosario", correct: false},
            {text: "Mendoza", correct: false},
        ]
    },
    {
        question: "What is the capital of Mexico?",
        answers: [
            {text: "Mexico City", correct: true},
            {text: "Guadalajara", correct: false},
            {text: "Monterrey", correct: false},
            {text: "Cancun", correct: false},
        ]
    },
    {
        question: "What is the capital of Saudi Arabia?",
        answers: [
            {text: "Riyadh", correct: true},
            {text: "Jeddah", correct: false},
            {text: "Mecca", correct: false},
            {text: "Medina", correct: false},
        ]
    },
    {
        question: "What is the capital of Turkey?",
        answers: [
            {text: "Ankara", correct: true},
            {text: "Istanbul", correct: false},
            {text: "Izmir", correct: false},
            {text: "Antalya", correct: false},
        ]
    },
    {
        question: "What is the capital of Greece?",
        answers: [
            {text: "Thessaloniki", correct: false},
            {text: "Athens", correct: true},
            {text: "Heraklion", correct: false},
            {text: "Patras", correct: false},
        ]
    },
    {
        question: "What is the capital of Kenya?",
        answers: [
            {text: "Nairobi", correct: true},
            {text: "Mombasa", correct: false},
            {text: "Kisumu", correct: false},
            {text: "Nakuru", correct: false},
        ]
    },
    {
        question: "What is the capital of Thailand?",
        answers: [
            {text: "Chiang Mai", correct: false},
            {text: "Pattaya", correct: false},
            {text: "Phuket", correct: false},
            {text: "Bangkok", correct: true},
        ]
    },
    {
        question: "What is the capital of Spain?",
        answers: [
            {text: "Madrid", correct: true},
            {text: "Barcelona", correct: false},
            {text: "Valencia", correct: false},
            {text: "Seville", correct: false},
        ]
    },
    {
        question: "What is the capital of Norway?",
        answers: [
            {text: "Oslo", correct: true},
            {text: "Bergen", correct: false},
            {text: "Stavanger", correct: false},
            {text: "Trondheim", correct: false},
        ]
    },
    {
        question: "What is the capital of Sweden?",
        answers: [
            {text: "Stockholm", correct: true},
            {text: "Gothenburg", correct: false},
            {text: "Malmo", correct: false},
            {text: "Uppsala", correct: false},
        ]
    },
    {
        question: "What is the capital of the Netherlands?",
        answers: [
            {text: "Amsterdam", correct: true},
            {text: "Rotterdam", correct: false},
            {text: "The Hague", correct: false},
            {text: "Utrecht", correct: false},
        ]
    },
    {
        question: "What is the capital of Hungary?",
        answers: [
            {text: "Budapest", correct: true},
            {text: "Debrecen", correct: false},
            {text: "Szeged", correct: false},
            {text: "Pecs", correct: false},
        ]
    },
    {
        question: "What is the capital of Poland?",
        answers: [
            {text: "Warsaw", correct: true},
            {text: "Krakow", correct: false},
            {text: "Gdansk", correct: false},
            {text: "Wroclaw", correct: false},
        ]
    },
    {
        question: "What is the capital of Iraq?",
        answers: [
            {text: "Baghdad", correct: true},
            {text: "Mosul", correct: false},
            {text: "Basra", correct: false},
            {text: "Erbil", correct: false},
        ]
    },
    {
        question: "What is the capital of Qatar?",
        answers: [
            {text: "Doha", correct: true},
            {text: "Al Wakrah", correct: false},
            {text: "Al Khor", correct: false},
            {text: "Al Rayyan", correct: false},
        ]
    },
    {
        question: "What is the capital of New Zealand?",
        answers: [
            {text: "Wellington", correct: true},
            {text: "Auckland", correct: false},
            {text: "Christchurch", correct: false},
            {text: "Hamilton", correct: false},
        ]
    },
    {
        question: "What is the capital of Denmark?",
        answers: [
            {text: "Copenhagen", correct: true},
            {text: "Aarhus", correct: false},
            {text: "Odense", correct: false},
            {text: "Aalborg", correct: false},
        ]
    },
    {
        question: "What is the capital of Ireland?",
        answers: [
            {text: "Dublin", correct: true},
            {text: "Galway", correct: false},
            {text: "Cork", correct: false},
            {text: "Limerick", correct: false},
        ]
    },
    {
        question: "What is the capital of Belgium?",
        answers: [
            {text: "Brussels", correct: true},
            {text: "Ghent", correct: false},
            {text: "Bruges", correct: false},
            {text: "Antwerp", correct: false},
        ]
    },
    {
        question: "What is the capital of Nigeria?",
        answers: [
            {text: "Abuja", correct: true},
            {text: "Lagos", correct: false},
            {text: "Kano", correct: false},
            {text: "Ibadan", correct: false},
        ]
    },
    {
        question: "What is the capital of Finland?",
        answers: [
            {text: "Helsinki", correct: true},
            {text: "Turku", correct: false},
            {text: "Tampere", correct: false},
            {text: "Espoo", correct: false},
        ]
    },
    {
        question: "What is the capital of Switzerland?",
        answers: [
            {text: "Bern", correct: true},
            {text: "Basel", correct: false},
            {text: "Zurich", correct: false},
            {text: "Geneva", correct: false},
        ]
    },
    {
        question: "What is the capital of Austria?",
        answers: [
            {text: "Vienna", correct: true},
            {text: "Salzburg", correct: false},
            {text: "Graz", correct: false},
            {text: "Innsbruck", correct: false},
        ]
    },
    {
        question: "What is the capital of Portugal?",
        answers: [
            {text: "Lisbon", correct: true},
            {text: "Porto", correct: false},
            {text: "Faro", correct: false},
            {text: "Coimbra", correct: false},
        ]
    }
  
];
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-btn');
const nextButton = document.getElementById('next-btn');
let currentquinx = 0;
let score = 0;
let shuffledQuestions = [];

function startquiz() {
    currentquinx = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    shuffledQuestions = questions.sort(() => Math.random() - 0.5).slice(0, 10); // Shuffle and select 10 questions
    ShowQuestion();
}

function ShowQuestion() {
    resetState();
    let currentque = shuffledQuestions[currentquinx];
    let questionNo = currentquinx + 1;
    questionElement.innerHTML = questionNo + ". " + currentque.question;
    currentque.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerHTML = answer.text;
        button.classList.add("btn");
        button.addEventListener('click', () => checkAnswer(answer.correct));
        answerButtons.appendChild(button);
        if(answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    
    })
}

function resetState() {
    nextButton.style.display = 'none';
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect"); 
    }

    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });

    nextButton.style.display = "block";
}

function ShowScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${shuffledQuestions.length} !`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentquinx++;
    if(currentquinx < shuffledQuestions.length) {
        ShowQuestion();
    } else {
        ShowScore();
    }
}

nextButton.addEventListener("click", () => {
    if(currentquinx < shuffledQuestions.length) {
        handleNextButton();
    } else {
        startquiz();
    }
});

startquiz();