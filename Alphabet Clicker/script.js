document.addEventListener('DOMContentLoaded', () => {
    const alphabetContainer = document.getElementById('alphabet-container');
    const scoreElement = document.getElementById('score');
    const resetButton = document.getElementById('reset');
    const highScoreElement = document.createElement('div');
    highScoreElement.classList.add('high-score');
    document.querySelector('.game-container').appendChild(highScoreElement);

    let score = 0;
    let highScore = 0;

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    // Load high score from local storage
    if (localStorage.getItem('highScore')) {
        highScore = parseInt(localStorage.getItem('highScore'), 10);
    }
    highScoreElement.textContent = `High Score: ${highScore}`;

    function initializeGame() {
        alphabetContainer.innerHTML = '';
        alphabet.forEach(letter => {
            const button = document.createElement('button');
            button.textContent = letter;
            button.classList.add('alphabet-button');
            button.addEventListener('click', () => {
                score++;
                scoreElement.textContent = score;
                if (score > highScore) {
                    highScore = score;
                    highScoreElement.textContent = `High Score: ${highScore}`;
                    localStorage.setItem('highScore', highScore);
                }
            });
            alphabetContainer.appendChild(button);
        });
    }

    resetButton.addEventListener('click', () => {
        score = 0;
        scoreElement.textContent = score;
        initializeGame();
    });

    initializeGame();
});