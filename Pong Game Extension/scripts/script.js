const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const paddleWidth = 10, paddleHeight = 100, ballSize = 10;
let scoreLeft = 0, scoreRight = 0;
const winningScore = 5;

let leftPaddle = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

let rightPaddle = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    dx: 1.5,  // Slower speed
    dy: 1.5  // Slower speed
};

function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawBall(x, y, size, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2);
    context.closePath();
    context.fill();
}

function drawScore() {
    document.getElementById('scoreLeft').textContent = scoreLeft;
    document.getElementById('scoreRight').textContent = scoreRight;
}

function update() {
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;

    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + paddleHeight > canvas.height) leftPaddle.y = canvas.height - paddleHeight;
    
    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y + paddleHeight > canvas.height) rightPaddle.y = canvas.height - paddleHeight;

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ballSize > canvas.height || ball.y - ballSize < 0) {
        ball.dy *= -1;
    }

    if (
        ball.x - ballSize < leftPaddle.x + leftPaddle.width &&
        ball.y > leftPaddle.y &&
        ball.y < leftPaddle.y + leftPaddle.height
    ) {
        ball.dx *= -1;
    }

    if (
        ball.x + ballSize > rightPaddle.x &&
        ball.y > rightPaddle.y &&
        ball.y < rightPaddle.y + rightPaddle.height
    ) {
        ball.dx *= -1;
    }

    if (ball.x < 0) {
        scoreRight++;
        resetBall();
    }

    if (ball.x > canvas.width) {
        scoreLeft++;
        resetBall();
    }

    if (scoreLeft === winningScore || scoreRight === winningScore) {
        endGame();
    }
}

function draw() {
    drawRect(0, 0, canvas.width, canvas.height, '#111');
    drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, '#fff');
    drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, '#fff');
    drawBall(ball.x, ball.y, ball.size, '#fff');
    drawScore();
}

function gameLoop() {
    update();
    draw();
    if (scoreLeft < winningScore && scoreRight < winningScore) {
        requestAnimationFrame(gameLoop);
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1;
    ball.dy *= -1;
}

function startGame() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('congratsPage').style.display = 'none';
    document.getElementById('scoreBoard').style.display = 'block';
    canvas.style.display = 'block';
    scoreLeft = 0;
    scoreRight = 0;
    gameLoop();
}

function restartGame() {
    document.getElementById('congratsPage').style.display = 'none';
    startGame();
}

function endGame() {
    document.getElementById('pongCanvas').style.display = 'none';
    document.getElementById('scoreBoard').style.display = 'none';
    document.getElementById('congratsPage').style.display = 'block';
    const winnerMessage = scoreLeft === winningScore ? "Player 1 Wins!" : "Player 2 Wins!";
    document.getElementById('winnerMessage').textContent = winnerMessage;
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            leftPaddle.dy = -6;
            break;
        case 's':
            leftPaddle.dy = 6;
            break;
        case 'ArrowUp':
            rightPaddle.dy = -6;
            break;
        case 'ArrowDown':
            rightPaddle.dy = 6;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
        case 's':
            leftPaddle.dy = 0;
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            rightPaddle.dy = 0;
            break;
    }
});

// Show homepage initially
document.getElementById('homePage').style.display = 'block';
document.getElementById('pongCanvas').style.display = 'none';
document