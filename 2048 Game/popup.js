const BOARD_SIZE = 4;

let board = [];
let score = 0;
let gameOver = false;

function initializeBoard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        board.push(Array(BOARD_SIZE).fill(0));
    }
}

function renderBoard() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';

    board.forEach(row => {
        const rowElement = document.createElement('div');
        rowElement.classList.add('game-row');

        row.forEach(cell => {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.textContent = cell === 0 ? '' : cell;
            tile.style.backgroundColor = getTileColor(cell);
            rowElement.appendChild(tile);
        });

        gameContainer.appendChild(rowElement);
    });
}

function getTileColor(value) {
    const colors = {
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e'
    };
    return colors[value] || '#3c3a32';
}

function addRandomTile() {
    const emptyCells = [];
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell === 0) {
                emptyCells.push({ row: rowIndex, col: colIndex });
            }
        });
    });

    if (emptyCells.length > 0) {
        const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function move(direction) {
    if (gameOver) return;

    let moved = false;

    switch (direction) {
        case 'up':
            moved = moveUp();
            break;
        case 'down':
            moved = moveDown();
            break;
        case 'left':
            moved = moveLeft();
            break;
        case 'right':
            moved = moveRight();
            break;
    }

    if (moved) {
        addRandomTile();
        renderBoard();
        updateScore();
        checkWin(); // Check for win after each move
        checkGameOver();
    }
}

function moveUp() {
    let moved = false;
    for (let col = 0; col < BOARD_SIZE; col++) {
        for (let row = 1; row < BOARD_SIZE; row++) {
            if (board[row][col] !== 0) {
                let nextRow = row - 1;
                while (nextRow >= 0) {
                    if (board[nextRow][col] === 0) {
                        board[nextRow][col] = board[row][col];
                        board[row][col] = 0;
                        row = nextRow; // Update current row to the new position
                        moved = true;
                    } else if (board[nextRow][col] === board[row][col]) {
                        board[nextRow][col] *= 2; // Merge cells by doubling the value
                        score += board[nextRow][col];
                        board[row][col] = 0;
                        moved = true;
                        break;
                    } else {
                        break; // Stop if we encounter a non-zero tile with different value
                    }
                    nextRow--;
                }
            }
        }
    }
    return moved;
}

function moveDown() {
    let moved = false;
    for (let col = 0; col < BOARD_SIZE; col++) {
        for (let row = BOARD_SIZE - 2; row >= 0; row--) {
            if (board[row][col] !== 0) {
                let nextRow = row + 1;
                while (nextRow < BOARD_SIZE) {
                    if (board[nextRow][col] === 0) {
                        board[nextRow][col] = board[row][col];
                        board[row][col] = 0;
                        row = nextRow; // Update current row to the new position
                        moved = true;
                    } else if (board[nextRow][col] === board[row][col]) {
                        board[nextRow][col] *= 2; // Merge cells by doubling the value
                        score += board[nextRow][col];
                        board[row][col] = 0;
                        moved = true;
                        break;
                    } else {
                        break; // Stop if we encounter a non-zero tile with different value
                    }
                    nextRow++;
                }
            }
        }
    }
    return moved;
}

function moveLeft() {
    let moved = false;
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 1; col < BOARD_SIZE; col++) {
            if (board[row][col] !== 0) {
                let nextCol = col - 1;
                while (nextCol >= 0) {
                    if (board[row][nextCol] === 0) {
                        board[row][nextCol] = board[row][col];
                        board[row][col] = 0;
                        col = nextCol; // Update current column to the new position
                        moved = true;
                    } else if (board[row][nextCol] === board[row][col]) {
                        board[row][nextCol] *= 2; // Merge cells by doubling the value
                        score += board[row][nextCol];
                        board[row][col] = 0;
                        moved = true;
                        break;
                    } else {
                        break; // Stop if we encounter a non-zero tile with different value
                    }
                    nextCol--;
                }
            }
        }
    }
    return moved;
}

function moveRight() {
    let moved = false;
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = BOARD_SIZE - 2; col >= 0; col--) {
            if (board[row][col] !== 0) {
                let nextCol = col + 1;
                while (nextCol < BOARD_SIZE) {
                    if (board[row][nextCol] === 0) {
                        board[row][nextCol] = board[row][col];
                        board[row][col] = 0;
                        col = nextCol; // Update current column to the new position
                        moved = true;
                    } else if (board[row][nextCol] === board[row][col]) {
                        board[row][nextCol] *= 2; // Merge cells by doubling the value
                        score += board[row][nextCol];
                        board[row][col] = 0;
                        moved = true;
                        break;
                    } else {
                        break; // Stop if we encounter a non-zero tile with different value
                    }
                    nextCol++;
                }
            }
        }
    }
    return moved;
}

function updateScore() {
    const scoreElement = document.getElementById('score-value');
    scoreElement.textContent = score;
}

function checkWin() {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === 2048) {
                showMessage('You Win!');
                gameOver = true;
                return true;
            }
        }
    }
    return false;
}

function checkGameOver() {
    let gameOver = true;
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === 0) {
                gameOver = false;
                break;
            }
            if (row < BOARD_SIZE - 1 && board[row][col] === board[row + 1][col]) {
                gameOver = false;
                break;
            }
            if (col < BOARD_SIZE - 1 && board[row][col] === board[row][col + 1]) {
                gameOver = false;
                break;
            }
        }
    }
    if (gameOver) {
        showMessage('Game Over!');
    }
}

function showMessage(message) {
    const messageContainer = document.getElementById('message-container');
    const gameOverMessage = document.getElementById('game-over-message');
    const winMessage = document.getElementById('win-message');

    if (message === 'You Win!') {
        winMessage.textContent = message;
        winMessage.style.display = 'block';
    } else {
        gameOverMessage.textContent = message;
        gameOverMessage.style.display = 'block';
    }
}

function startGame() {
    initializeBoard();
    addRandomTile();
    addRandomTile();
    renderBoard();
    updateScore();
    gameOver = false;

    // Hide any existing messages
    document.getElementById('game-over-message').style.display = 'none';
    document.getElementById('win-message').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', startGame);
document.addEventListener('keydown', function (event) {
    if (!gameOver) {
        if (event.key === 'ArrowUp') {
            move('up');
        } else if (event.key === 'ArrowDown') {
            move('down');
        } else if (event.key === 'ArrowLeft') {
            move('left');
        } else if (event.key === 'ArrowRight') {
            move('right');
        }
    }
});

document.getElementById('play-again-btn').addEventListener('click', function () {
    board = [];
    score = 0;
    gameOver = false;
    startGame();
    showMessage(''); // Hide the game over or win message
});
