document.addEventListener('DOMContentLoaded', () => {
    const playerBoard = document.getElementById('player-board');
    const computerBoard = document.getElementById('computer-board');
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('reset-button');
    const boardSize = 10;
    const shipLengths = [5, 4, 3, 3, 2];
    let playerShips = [];
    let computerShips = [];
    let playerHits = [];
    let computerHits = [];
    let currentPlayer = 'player';
    let gameActive = true;

    function createBoard(boardElement) {
        for (let i = 0; i < boardSize * boardSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            boardElement.appendChild(cell);
        }
    }

    function placeShipsRandomly(ships) {
        for (let length of shipLengths) {
            let placed = false;
            while (!placed) {
                const isHorizontal = Math.random() < 0.5;
                const row = Math.floor(Math.random() * boardSize);
                const col = Math.floor(Math.random() * boardSize);
                if (canPlaceShip(row, col, length, isHorizontal, ships)) {
                    placeShip(row, col, length, isHorizontal, ships);
                    placed = true;
                }
            }
        }
    }

    function canPlaceShip(row, col, length, isHorizontal, ships) {
        for (let i = 0; i < length; i++) {
            const r = row + (isHorizontal ? 0 : i);
            const c = col + (isHorizontal ? i : 0);
            if (r >= boardSize || c >= boardSize || ships.some(ship => ship.includes(r * boardSize + c))) {
                return false;
            }
        }
        return true;
    }

    function placeShip(row, col, length, isHorizontal, ships) {
        const ship = [];
        for (let i = 0; i < length; i++) {
            const r = row + (isHorizontal ? 0 : i);
            const c = col + (isHorizontal ? i : 0);
            ship.push(r * boardSize + c);
        }
        ships.push(ship);
    }

    function handleCellClick(event) {
        if (!gameActive) return;
        const index = event.target.dataset.index;
        if (currentPlayer === 'player' && !playerHits.includes(index)) {
            playerHits.push(index);
            const hit = computerShips.some(ship => ship.includes(parseInt(index)));
            event.target.classList.add(hit ? 'hit' : 'miss');
            if (hit) {
                statusDisplay.textContent = "Hit!";
                if (checkWin(computerShips, playerHits)) {
                    statusDisplay.textContent = "Player wins!";
                    gameActive = false;
                }
            } else {
                statusDisplay.textContent = "Miss!";
                currentPlayer = 'computer';
                setTimeout(computerTurn, 1000);
            }
        }
    }

    function computerTurn() {
        let index;
        do {
            index = Math.floor(Math.random() * boardSize * boardSize);
        } while (computerHits.includes(index));
        computerHits.push(index);
        const cell = playerBoard.children[index];
        const hit = playerShips.some(ship => ship.includes(index));
        cell.classList.add(hit ? 'hit' : 'miss');
        if (hit) {
            statusDisplay.textContent = "Computer hit!";
            if (checkWin(playerShips, computerHits)) {
                statusDisplay.textContent = "Computer wins!";
                gameActive = false;
            } else {
                setTimeout(computerTurn, 1000);
            }
        } else {
            statusDisplay.textContent = "Computer miss!";
            currentPlayer = 'player';
        }
    }

    function checkWin(ships, hits) {
        return ships.every(ship => ship.every(cell => hits.includes(cell.toString())));
    }

    function resetGame() {
        playerBoard.innerHTML = '';
        computerBoard.innerHTML = '';
        playerShips = [];
        computerShips = [];
        playerHits = [];
        computerHits = [];
        currentPlayer = 'player';
        gameActive = true;
        statusDisplay.textContent = "Player's turn";
        createBoard(playerBoard);
        createBoard(computerBoard);
        placeShipsRandomly(playerShips);
        placeShipsRandomly(computerShips);
    }

    createBoard(playerBoard);
    createBoard(computerBoard);
    placeShipsRandomly(playerShips);
    placeShipsRandomly(computerShips);
    computerBoard.addEventListener('click', handleCellClick);
    resetButton.addEventListener('click', resetGame);
    statusDisplay.textContent = "Player's turn";
});