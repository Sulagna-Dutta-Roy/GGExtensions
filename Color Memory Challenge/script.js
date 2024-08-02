const colorBoxes = document.getElementById('color-boxes');
const startButton = document.getElementById('start-button');
const message = document.getElementById('message');

let colors = [];
let sequence = [];
let userInput = [];
let round = 0;

// Start the game
startButton.addEventListener('click', startGame);

function startGame() {
    round = 0;
    sequence = [];
    message.textContent = '';
    generateSequence();
}

// Generate a random color sequence
function generateSequence() {
    colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];
    sequence.push(colors[Math.floor(Math.random() * colors.length)]);
    displaySequence();
}

// Display the sequence to the user
function displaySequence() {
    colorBoxes.innerHTML = '';
    sequence.forEach((color, index) => {
        setTimeout(() => {
            createColorBox(color);
            if (index === sequence.length - 1) {
                setTimeout(() => {
                    getUserInput();
                }, 1000);
            }
        }, index * 1000);
    });
}

// Create a color box
function createColorBox(color) {
    const box = document.createElement('div');
    box.className = 'box';
    box.style.backgroundColor = color;
    colorBoxes.appendChild(box);
}

// Get user input
function getUserInput() {
    colorBoxes.innerHTML = '';
    colors.forEach(color => {
        const box = document.createElement('div');
        box.className = 'box';
        box.style.backgroundColor = color;
        box.addEventListener('click', () => handleUserClick(color));
        colorBoxes.appendChild(box);
    });
}

// Handle user clicks
function handleUserClick(color) {
    userInput.push(color);
    checkUserInput();
}

// Check user input
function checkUserInput() {
    const currentRound = userInput.length - 1;
    if (userInput[currentRound] !== sequence[currentRound]) {
        message.textContent = 'Wrong! Game Over.';
        return;
    }
    if (userInput.length === sequence.length) {
        userInput = [];
        round++;
        setTimeout(() => {
            generateSequence();
        }, 1000);
    }
}
