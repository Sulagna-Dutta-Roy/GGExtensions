document.addEventListener('DOMContentLoaded', () => {
  const boardSize = 10;
  const mineCount = 15;
  let gameBoard = [];
  let mines = [];
  const gameBoardElement = document.getElementById('game-board');
  const resetButton = document.getElementById('reset-button');

  function initGame() {
    gameBoard = [];
    mines = [];
    gameBoardElement.innerHTML = '';
    createBoard();
    placeMines();
    addEventListeners();
  }

  function createBoard() {
    for (let i = 0; i < boardSize * boardSize; i++) {
      const hex = document.createElement('div');
      hex.classList.add('hex');
      gameBoardElement.appendChild(hex);
      gameBoard.push(hex);
    }
  }

  function placeMines() {
    while (mines.length < mineCount) {
      const randomIndex = Math.floor(Math.random() * gameBoard.length);
      if (!mines.includes(randomIndex)) {
        mines.push(randomIndex);
        gameBoard[randomIndex].classList.add('mine');
      }
    }
  }

  function addEventListeners() {
    gameBoard.forEach((hex, index) => {
      hex.addEventListener('click', () => {
        if (hex.classList.contains('mine')) {
          alert('Game Over!');
          revealMines();
        } else {
          hex.classList.add('safe');
        }
      });

      hex.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        hex.classList.toggle('flagged');
      });
    });

    resetButton.addEventListener('click', initGame);
  }

  function revealMines() {
    mines.forEach(index => {
      gameBoard[index].classList.add('revealed');
    });
  }

  initGame();
});
