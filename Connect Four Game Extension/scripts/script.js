document.addEventListener("DOMContentLoaded", () => {
  const columns = 7;
  const rows = 6;
  const board = [];
  let currentPlayer = "red";
  let gameActive = true;

  const gameBoard = document.getElementById("game-board");
  const statusDisplay = document.getElementById("status");
  const resetButton = document.getElementById("reset-button");

  function createBoard() {
    for (let r = 0; r < rows; r++) {
      board[r] = [];
      for (let c = 0; c < columns; c++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.addEventListener("click", handleCellClick);
        gameBoard.appendChild(cell);
        board[r][c] = "";
      }
    }
  }

  function handleCellClick(event) {
    if (!gameActive) return;

    const col = event.target.dataset.col;
    for (let r = rows - 1; r >= 0; r--) {
      if (board[r][col] === "") {
        board[r][col] = currentPlayer;
        const cell = document.querySelector(
          `.cell[data-row="${r}"][data-col="${col}"]`
        );
        cell.classList.add(currentPlayer);
        if (checkWin(r, col)) {
          gameActive = false;
          statusDisplay.textContent = "${currentPlayer.toUpperCase()} wins!";
        } else if (board.flat().every((cell) => cell !== "")) {
          gameActive = false;
          statusDisplay.textContent = "It's a draw!";
        } else {
          currentPlayer = currentPlayer === "red" ? "yellow" : "red";
          statusDisplay.textContent = currentPlayer.toUpperCase() + "'s turn";
        }
        break;
      }
    }
  }

  function checkWin(row, col) {
    const directions = [
      { r: 0, c: 1 },
      { r: 1, c: 0 },
      { r: 1, c: 1 },
      { r: 1, c: -1 },
    ];
    for (let { r, c } of directions) {
      if (
        checkDirection(row, col, r, c) + checkDirection(row, col, -r, -c) >
        2
      ) {
        return true;
      }
    }
    return false;
  }

  function checkDirection(row, col, rowDir, colDir) {
    let count = 0;
    let r = row + rowDir;
    let c = col + colDir;
    while (
      r >= 0 &&
      r < rows &&
      c >= 0 &&
      c < columns &&
      board[r][c] === currentPlayer
    ) {
      count++;
      r += rowDir;
      c += colDir;
    }
    return count;
  }

  function resetGame() {
    gameBoard.innerHTML = "";
    createBoard();
    currentPlayer = "red";
    gameActive = true;
    statusDisplay.textContent = currentPlayer.toUpperCase() + "'s turn";
  }

  createBoard();
  resetButton.addEventListener("click", resetGame);
});
