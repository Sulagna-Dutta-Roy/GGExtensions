document.addEventListener('DOMContentLoaded', () => {
    const colorButtons = document.querySelectorAll('.color-button');
    const startButton = document.getElementById('start-button');
    let sequence = [];
    let playerSequence = [];
    let level = 0;

    startButton.addEventListener('click', startGame);

    colorButtons.forEach(button => {
        button.addEventListener('click', event => {
            const color = event.target.id;
            playerSequence.push(color);
            animateButton(color);
            checkSequence();
        });
    });

    function startGame() {
        sequence = [];
        playerSequence = [];
        level = 0;
        nextLevel();
    }

    function nextLevel() {
        level++;
        playerSequence = [];
        const nextColor = getRandomColor();
        sequence.push(nextColor);
        animateSequence();
    }

    function getRandomColor() {
        const colors = ['red', 'green', 'blue', 'yellow'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function animateSequence() {
        let delay = 0;
        sequence.forEach(color => {
            setTimeout(() => {
                animateButton(color);
            }, delay);
            delay += 600;
        });
    }

    function animateButton(color) {
        const button = document.getElementById(color);
        button.style.opacity = 0.5;
        setTimeout(() => {
            button.style.opacity = 1;
        }, 300);
    }

    function checkSequence() {
        const currentLevel = playerSequence.length;
        if (playerSequence[currentLevel - 1] !== sequence[currentLevel - 1]) {
            alert('Game Over! You reached level ' + level);
            startGame();
            return;
        }

        if (playerSequence.length === sequence.length) {
            setTimeout(nextLevel, 1000);
        }
    }
});
