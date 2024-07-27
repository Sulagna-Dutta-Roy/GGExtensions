const buttons = document.querySelectorAll('.wigglenog-button');
const resultContainer = document.getElementById('result-container');
const startGameButton = document.getElementById('start-game');

let sequence = [];
let userSequence = [];

function startGame() {
    sequence = generateSequence(4);
    userSequence = [];
    resultContainer.textContent = 'Memorize the sequence!';
    displaySequence(sequence);
}

function generateSequence(length) {
    const arr = [];
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * buttons.length);
        arr.push(buttons[randomIndex].id);
    }
    return arr;
}

function displaySequence(seq) {
    let index = 0;
    const interval = setInterval(() => {
        if (index < seq.length) {
            const button = document.getElementById(seq[index]);
            button.classList.add('active');
            setTimeout(() => button.classList.remove('active'), 500);
            index++;
        } else {
            clearInterval(interval);
            resultContainer.textContent = 'Your turn!';
        }
    }, 1000);
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        userSequence.push(button.id);
        if (userSequence.length === sequence.length) {
            checkSequence();
        }
    });
});

function checkSequence() {
    const isCorrect = userSequence.every((val, index) => val === sequence[index]);
    if (isCorrect) {
        resultContainer.textContent = 'You win!';
    } else {
        resultContainer.textContent = 'Try again!';
    }
}

startGameButton.addEventListener('click', startGame);

fetch('manifest.json')
    .then(response => response.json())
    .then(manifest => {
        console.log(manifest);
        // Use data.highScores or data.gameConfig as needed
    })
    .catch(error => console.error('Error loading JSON:', error));