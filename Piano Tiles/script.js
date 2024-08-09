var config = {
  width: 300,
  height: 600,
  rows: 6,
  cols: 4,
  speed: 5,
  interval: 20,
};
config.height = 600 - 2;
config.defaultSpeed = config.speed;
var score = 0;
var scoreElement;
var startGameElement, endGameElement;
var scoreElement;
var gameLoop;
var tileRows = [];
var gameCanvas;
var gameContext;
var isGameStarted = false;
document.addEventListener(
  "DOMContentLoaded",
  function () {
    console.log("Script Loaded");
    gameCanvas = document.getElementById("gameCanvas");
    scoreElement = document.getElementById("score");
    startGameElement = document.getElementById("gameStart");
    endGameElement = document.getElementById("gameEnd");
    gameContext = gameCanvas.getContext("2d");
    gameCanvas.style.width = config.width + "px";
    gameCanvas.style.height = config.height + "px";
    gameCanvas.setAttribute("width", config.width);
    gameCanvas.setAttribute("height", config.height);
    gameContext.lineWidth = 0.5;
    initGame();
  },
  null
);

function addRow() {
  var black_index = Math.floor(Math.random() * config.cols);
  var tile_width = config.width / config.cols;
  var tile_height = config.height / config.rows;
  var y = config.height;
  if (tileRows.length > 0) {
    var lastRow = tileRows[tileRows.length - 1];
    y = lastRow.y + lastRow.height;
  }
  var row = {
    x: 0,
    y: y,
    width: config.width,
    height: config.height / config.rows,
    tileWidth: tile_width,
    tileHeight: tile_height,
    color: "#FFFFFF",
    black: {
      index: black_index,
      color: "#000000",
    },
    increament: function () {
      if (this.y <= 0) {
        console.log(this.isValid);
        if (!this.isValid) {
          console.log("Game Over");
          stopGameLoop();
          this.y -= config.speed;
          displayWrongTile(this, this.black.index);
          return;
        }
      }
      this.y = this.y - config.speed;
    },
    decreament: function () {
      this.y = this.y + config.speed;
    },
    isValid: false,
  };
  tileRows.push(row);
}

function displayRow(row) {
  gameContext.fillStyle = row.color;
  gameContext.fillRect(0, row.y, row.width, row.height);
  for (var i = 0; i < config.cols; i++) {
    gameContext.strokeRect(
      i * row.tileWidth,
      row.y,
      row.tileWidth,
      row.tileHeight
    );

    if (row.black.index == i) {
      gameContext.fillStyle = row.black.color;
      gameContext.fillRect(
        i * row.tileWidth,
        row.y,
        row.tileWidth,
        row.tileHeight
      );
    }
  }
  row.increament();
}
function startGameLoop() {
  gameLoop = setInterval(function () {
    displayAllRow();
  }, config.interval);
}
function displayAllRow() {
  gameContext.clearRect(0, 0, config.width, config.height);
  for (var i = 0; i < tileRows.length; i++) {
    displayRow(tileRows[i]);
  }
}

function stopGameLoop() {
  clearInterval(gameLoop);
  gameCanvas.removeEventListener("click", handleGameUserInput);
  endGameElement.style.display = "block";
}

function handleGameUserInput(e) {
  if (!isGameStarted) {
    isGameStarted = true;
    startGameLoop();
  }
  var tile_width = config.width / config.cols;
  var tile_height = config.height / config.rows;
  var x = e.clientX - gameCanvas.offsetLeft;
  var y = e.clientY - gameCanvas.offsetTop;
  var clicked_row = Math.ceil(y / tile_height) - 1;
  var clicked_col = Math.ceil(x / tile_width) - 1;
  for (var i = 0; i < tileRows.length; i++) {
    var row = tileRows[i];
    if (row.y < y && row.y + row.height > y) {
      if (clicked_col === row.black.index) {
        if (!row.isValid) {
          row.isValid = true;
          row.black.color = "#AAAAAA";
          score++;
          scoreElement.innerHTML = score;
          addRow();
        } else {
          stopGameLoop();
          displayWrongTile(row, clicked_col);
        }
      } else {
        stopGameLoop();
        displayWrongTile(row, clicked_col);
      }
      break;
    }
  }
}

function displayWrongTile(row, col_number) {
  gameContext.fillStyle = "#FF0000";
  row.decreament();
  gameContext.fillRect(
    col_number * row.tileWidth,
    row.y,
    row.tileWidth,
    row.tileHeight
  );
}

function initGame() {
  gameContext.clearRect(0, 0, config.width, config.height);
  for (var i = 0; i < config.rows; i++) {
    addRow();
  }
  for (var j = 0; j < 50; j++) {
    for (var i = 0; i < tileRows.length; i++) {
      tileRows[i].increament();
    }
  }
  for (var i = 0; i < tileRows.length; i++) {
    displayRow(tileRows[i]);
  }
}

document.getElementById("startBtn").addEventListener("click", startGame)
function startGame() {
  endGameElement.style.display = "none";
  startGameElement.style.display = "none";
  gameCanvas.addEventListener("click", handleGameUserInput);
}

document.getElementById("restartBtn").addEventListener("click", restartGame);

function restartGame() {
  tileRows = [];
  score = 0;
  isGameStarted = false;
  config.speed = config.defaultSpeed;
  scoreElement.innerHTML = score;
  endGameElement.style.display = "none";
  initGame();
  startGame();
  // setTimeout(startGame,1000);
}


