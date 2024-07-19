document.addEventListener('DOMContentLoaded', () => {
    const acrobat = document.getElementById('acrobat');
    const obstacles = document.querySelectorAll('.obstacle');
    const scoreElement = document.getElementById('score');
    const gameOverElement = document.getElementById('game-over');
    let gameInterval;
    let score = 0;
    let jumping = false;
    let gameOver = false;

    function jump() {
        if (jumping || gameOver) return;
        jumping = true;
        let jumpHeight = 0;
        let jumpUp = setInterval(() => {
            if (jumpHeight >= 150) {
                clearInterval(jumpUp);
                let fallDown = setInterval(() => {
                    if (jumpHeight <= 0) {
                        clearInterval(fallDown);
                        jumping = false;
                    }
                    jumpHeight -= 5;
                    acrobat.style.bottom = jumpHeight + 'px';
                }, 20);
            }
            jumpHeight += 5;
            acrobat.style.bottom = jumpHeight + 'px';
        }, 20);
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') jump();
    });

    function checkCollision() {
        const acrobatRect = acrobat.getBoundingClientRect();
        obstacles.forEach(obstacle => {
            const obstacleRect = obstacle.getBoundingClientRect();
            if (
                acrobatRect.left < obstacleRect.right &&
                acrobatRect.right > obstacleRect.left &&
                acrobatRect.top < obstacleRect.bottom &&
                acrobatRect.bottom > obstacleRect.top
            ) {
                endGame();
            }
        });
    }

    function endGame() {
        gameOver = true;
        gameOverElement.style.display = 'block';
        clearInterval(gameInterval);
    }

    function resetGame() {
        acrobat.style.bottom = '0px';
        obstacles.forEach(obstacle => {
            obstacle.style.right = '-50px';
        });
        score = 0;
        scoreElement.textContent = 'Score: 0';
        gameOverElement.style.display = 'none';
        gameOver = false;
        gameInterval = setInterval(gameLoop, 20);
    }

    function gameLoop() {
        if (!gameOver) {
            score += 1;
            scoreElement.textContent = 'Score: ' + score;
            checkCollision();
        }
    }

    resetGame();
});
