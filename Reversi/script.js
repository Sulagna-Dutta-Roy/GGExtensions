document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const SIZE = 8;
    let currentPlayer = 'B';

    const createBoard = () => {
        board.innerHTML = '';
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.dataset.row = i;
                square.dataset.col = j;

                if ((i === 3 && j === 3) || (i === 4 && j === 4)) {
                    square.classList.add('white');
                } else if ((i === 3 && j === 4) || (i === 4 && j === 3)) {
                    square.classList.add('black');
                }

                square.addEventListener('click', () => handleMove(square));
                board.appendChild(square);
            }
        }
    };

    const handleMove = (square) => {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        
        if (square.classList.contains('black') || square.classList.contains('white')) {
            return;
        }

        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1], // vertical and horizontal
            [-1, -1], [-1, 1], [1, -1], [1, 1] // diagonals
        ];

        let validMove = false;

        directions.forEach(([dx, dy]) => {
            let x = row + dx;
            let y = col + dy;
            let hasOpponentPiece = false;

            while (x >= 0 && x < SIZE && y >= 0 && y < SIZE) {
                const targetSquare = document.querySelector(`[data-row='${x}'][data-col='${y}']`);
                
                if (targetSquare.classList.contains(currentPlayer === 'B' ? 'white' : 'black')) {
                    hasOpponentPiece = true;
                } else if ((targetSquare.classList.contains(currentPlayer === 'B' ? 'black' : 'white')) && hasOpponentPiece) {
                    let flipX = row;
                    let flipY = col;

                    while (flipX !== x || flipY !== y) {
                        const flipSquare = document.querySelector(`[data-row='${flipX}'][data-col='${flipY}']`);
                        flipSquare.classList.remove('black', 'white');
                        flipSquare.classList.add(currentPlayer === 'B' ? 'black' : 'white');
                        flipX += dx;
                        flipY += dy;
                    }

                    validMove = true;
                    break;
                } else {
                    break;
                }

                x += dx;
                y += dy;
            }
        });

        if (validMove) {
            square.classList.add(currentPlayer === 'B' ? 'black' : 'white');
            currentPlayer = currentPlayer === 'B' ? 'W' : 'B';
        }
    };

    createBoard();
});
