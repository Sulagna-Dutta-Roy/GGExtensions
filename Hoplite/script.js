document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const boardSize = 5;
    const heroPosition = { x: 2, y: 2 };
    const enemies = [{ x: 1, y: 1 }, { x: 3, y: 3 }];

    function createBoard() {
        for (let y = 0; y < boardSize; y++) {
            for (let x = 0; x < boardSize; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.x = x;
                cell.dataset.y = y;
                gameBoard.appendChild(cell);
            }
        }
        renderBoard();
    }

    function renderBoard() {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('hero', 'enemy');
        });

        const heroCell = document.querySelector(`.cell[data-x='${heroPosition.x}'][data-y='${heroPosition.y}']`);
        heroCell.classList.add('hero');

        enemies.forEach(enemy => {
            const enemyCell = document.querySelector(`.cell[data-x='${enemy.x}'][data-y='${enemy.y}']`);
            enemyCell.classList.add('enemy');
        });
    }

    function moveHero(x, y) {
        if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
            heroPosition.x = x;
            heroPosition.y = y;
            renderBoard();
        }
    }

    document.addEventListener('keydown', (event) => {
        const { x, y } = heroPosition;
        switch (event.key) {
            case 'ArrowUp':
                moveHero(x, y - 1);
                break;
            case 'ArrowDown':
                moveHero(x, y + 1);
                break;
            case 'ArrowLeft':
                moveHero(x - 1, y);
                break;
            case 'ArrowRight':
                moveHero(x + 1, y);
                break;
        }
    });

    createBoard();
});
