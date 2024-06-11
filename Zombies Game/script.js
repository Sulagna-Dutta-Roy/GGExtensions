const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const gameContainer = document.getElementById('gameContainer');
const player = document.getElementById('player');
const zombie = document.getElementById('zombie');
const scoreDisplay = document.getElementById('score');
const gameContainerRect = gameContainer.getBoundingClientRect();

let playerPos = { x: gameContainerRect.width / 2 - 25, y: gameContainerRect.height - 50 };
let zombiePos = { x: gameContainerRect.width / 2 - 25, y: 0 };
let score = 0;

let zombieSpeed = 2;
let playerSpeed = 5;
let gameInterval;

startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    startGame();
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        playerPos.x -= playerSpeed;
    } else if (event.key === 'ArrowRight') {
        playerPos.x += playerSpeed;
    }
    playerPos.x = Math.max(0, Math.min(playerPos.x, gameContainerRect.width - 50));
    updatePlayerPosition();
});

function updatePlayerPosition() {
    player.style.left = `${playerPos.x}px`;
}

function updateZombiePosition() {
    zombiePos.y += zombieSpeed;
    if (zombiePos.y > gameContainerRect.height) {
        zombiePos.y = 0;
        zombiePos.x = Math.random() * (gameContainerRect.width - 50);
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        zombieSpeed += 0.5;
    }
    zombie.style.top = `${zombiePos.y}px`;
    zombie.style.left = `${zombiePos.x}px`;
}

function checkCollision() {
    if (
        zombiePos.x < playerPos.x + 50 &&
        zombiePos.x + 50 > playerPos.x &&
        zombiePos.y < playerPos.y + 50 &&
        zombiePos.y + 50 > playerPos.y
    ) {
        alert('Game Over! Your score: ' + score);
        resetGame();
    }
}

function resetGame() {
    playerPos = { x: gameContainerRect.width / 2 - 25, y: gameContainerRect.height - 50 };
    zombiePos = { x: gameContainerRect.width / 2 - 25, y: 0 };
    zombieSpeed = 2;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    updatePlayerPosition();
    updateZombiePosition();
}

function startGame() {
    gameInterval = setInterval(() => {
        updateZombiePosition();
        checkCollision();
    }, 1000 / 60);
}

function stopGame() {
    clearInterval(gameInterval);
}
