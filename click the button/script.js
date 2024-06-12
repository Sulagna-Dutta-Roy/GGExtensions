document.addEventListener('DOMContentLoaded', (event) => {
    let score = 0;
    const button = document.getElementById('clickButton');
    const scoreDisplay = document.getElementById('score');

    button.addEventListener('click', () => {
        score++;
        scoreDisplay.textContent = score;
    });
});
