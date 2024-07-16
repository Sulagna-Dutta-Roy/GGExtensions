const gameContainer = document.getElementById('game-container');
const mouse = document.getElementById('mouse');
const exit = document.getElementById('exit');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');

let mouseX = 15;
let mouseY = 45;
let timeLeft = 30;
let gameInterval;
let walls = [];

function createWall(x, y, width, height) {
    const wall = document.createElement('div');
    wall.className = 'wall';
    wall.style.left = x + 'px';
    wall.style.top = y + 'px';
    wall.style.width = width + 'px';
    wall.style.height = height + 'px';
    gameContainer.appendChild(wall);
    walls.push(wall);
}

function createMaze() {
    walls.forEach(wall => wall.remove());
    walls = [];

    const wallSegments = [
        // Vertical walls
        {x: 50, y: 0, width: 10, height: 100},
        {x: 200, y: 0, width: 10, height: 150},
        {x: 150, y: 100, width: 10, height: 100},
        {x: 100, y: 150, width: 10, height: 50},
        {x: 250, y: 150, width: 10, height: 100},
        
        // Horizontal walls
        {x: 0, y: 90, width: 100, height: 10},
        {x: 100, y: 40, width: 150, height: 10},
        {x: 50, y: 140, width: 160, height: 10},
        {x: 0, y: 240, width: 250, height: 10},
        {x: 150, y: 190, width: 110, height: 10},
    ];

    wallSegments.forEach(segment => {
        createWall(segment.x, segment.y, segment.width, segment.height);
    });

    exit.style.right = '10px';
    exit.style.bottom = '10px';
}

function updateMousePosition() {
    mouse.style.left = mouseX + 'px';
    mouse.style.top = mouseY + 'px';
}

function checkCollision() {
    const mouseRect = mouse.getBoundingClientRect();
    for (const wall of walls) {
        const wallRect = wall.getBoundingClientRect();
        if (
            mouseRect.left < wallRect.right &&
            mouseRect.right > wallRect.left &&
            mouseRect.top < wallRect.bottom &&
            mouseRect.bottom > wallRect.top
        ) {
            return true;
        }
    }
    return false;
}

function checkWin() {
    const mouseRect = mouse.getBoundingClientRect();
    const exitRect = exit.getBoundingClientRect();
    return (
        mouseRect.left < exitRect.right &&
        mouseRect.right > exitRect.left &&
        mouseRect.top < exitRect.bottom &&
        mouseRect.bottom > exitRect.top
    );
}

function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
        endGame('Time\'s up! You lose.');
    }
}

function endGame(message) {
    clearInterval(gameInterval);
    alert(message);
    startBtn.disabled = false;
    chrome.runtime.sendMessage({action: 'gameCompleted', time: 30 - timeLeft});
}

function startGame() {
    mouseX = 15;
    mouseY = 45;
    timeLeft = 30;
    updateMousePosition();
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    startBtn.disabled = true;
    gameInterval = setInterval(updateTimer, 1000);
}


startBtn.addEventListener('click', startGame);

document.addEventListener('keydown', (e) => {
    const speed = 5;
    let newX = mouseX;
    let newY = mouseY;

    switch (e.key) {
        case 'ArrowUp':
            newY -= speed;
            break;
        case 'ArrowDown':
            newY += speed;
            break;
        case 'ArrowLeft':
            newX -= speed;
            break;
        case 'ArrowRight':
            newX += speed;
            break;
    }

    if (
        newX >= 0 &&
        newX <= gameContainer.clientWidth - mouse.clientWidth &&
        newY >= 0 &&
        newY <= gameContainer.clientHeight - mouse.clientHeight
    ) {
        mouseX = newX;
        mouseY = newY;
        updateMousePosition();

        if (checkCollision()) {
            mouseX = 10;
            mouseY = 10;
            updateMousePosition();
        }

        if (checkWin()) {
            endGame('Congratulations! You escaped the maze!');
        }
    }
});

createMaze();
updateMousePosition();