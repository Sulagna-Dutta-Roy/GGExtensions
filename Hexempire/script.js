document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("game-board");
    const message = document.getElementById("message");
    const endTurnButton = document.getElementById("end-turn");
    const rows = 10;
    const cols = 10;
    let currentPlayer = 1;
    let selectedHex = null;
    let board = Array(rows * cols).fill(0);

    // Initialize game board
    function initBoard() {
        gameBoard.innerHTML = "";
        board = board.map((cell, index) => {
            if (index === 0) return 1; // Player 1's starting position
            if (index === rows * cols - 1) return 2; // Player 2's starting position
            return 0;
        });
        board.forEach((cell, index) => {
            const hex = document.createElement("div");
            hex.classList.add("hex");
            if (cell === 1) hex.classList.add("player1");
            if (cell === 2) hex.classList.add("player2");
            hex.addEventListener("click", () => selectHex(index));
            gameBoard.appendChild(hex);
        });
        updateMessage(`Player ${currentPlayer}'s turn`);
    }

    // Select hex
    function selectHex(index) {
        if (board[index] === currentPlayer) {
            selectedHex = index;
            renderBoard();
        } else if (selectedHex !== null && isValidMove(selectedHex, index)) {
            board[index] = currentPlayer;
            board[selectedHex] = 0;
            selectedHex = null;
            renderBoard();
            checkWin();
        }
    }

    // Check if move is valid
    function isValidMove(from, to) {
        const distance = Math.abs(from - to);
        return distance === 1 || distance === cols || distance === cols - 1 || distance === cols + 1;
    }

    // Render board
    function renderBoard() {
        const hexes = document.querySelectorAll(".hex");
        hexes.forEach((hex, index) => {
            hex.className = "hex";
            if (board[index] === 1) hex.classList.add("player1");
            if (board[index] === 2) hex.classList.add("player2");
            if (index === selectedHex) hex.classList.add("selected");
        });
    }

    // Check win condition
    function checkWin() {
        if (board[0] === 2) {
            updateMessage("Player 2 wins!");
            endGame();
        } else if (board[rows * cols - 1] === 1) {
            updateMessage("Player 1 wins!");
            endGame();
        } else {
            endTurn();
        }
    }

    // End turn
    function endTurn() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateMessage(`Player ${currentPlayer}'s turn`);
    }

    // Update message
    function updateMessage(text) {
        message.textContent = text;
    }

    // End game
    function endGame() {
        selectedHex = null;
        document.querySelectorAll(".hex").forEach(hex => hex.removeEventListener("click", selectHex));
    }

    // Restart game
    endTurnButton.addEventListener("click", initBoard);

    initBoard();
});
