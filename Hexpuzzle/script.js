document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("game-board");
    const restartButton = document.getElementById("restart");
    const rows = 6;
    const cols = 6;
    let tiles = [];

    // Initialize game board
    function initBoard() {
        gameBoard.innerHTML = "";
        tiles = generateTiles();
        tiles.forEach(tile => {
            const hex = document.createElement("div");
            hex.classList.add("hex");
            hex.style.transform = `rotate(${tile.rotation}deg)`;
            hex.addEventListener("click", () => rotateTile(tile));
            gameBoard.appendChild(hex);
        });
    }

    // Generate tiles
    function generateTiles() {
        let tileArray = [];
        for (let i = 0; i < rows * cols; i++) {
            tileArray.push({
                id: i,
                rotation: Math.floor(Math.random() * 6) * 60
            });
        }
        return tileArray;
    }

    // Rotate tile
    function rotateTile(tile) {
        tile.rotation = (tile.rotation + 60) % 360;
        renderBoard();
        checkSolution();
    }

    // Render board
    function renderBoard() {
        const hexes = document.querySelectorAll(".hex");
        hexes.forEach((hex, index) => {
            hex.style.transform = `rotate(${tiles[index].rotation}deg)`;
        });
    }

    // Check solution
    function checkSolution() {
        const hexes = document.querySelectorAll(".hex");
        let correct = true;
        hexes.forEach((hex, index) => {
            if (tiles[index].rotation !== 0) {
                hex.classList.add("incorrect");
                hex.classList.remove("correct");
                correct = false;
            } else {
                hex.classList.remove("incorrect");
                hex.classList.add("correct");
            }
        });
        if (correct) {
            alert("Puzzle Solved! Click Restart to play again.");
        }
    }

    // Restart game
    restartButton.addEventListener("click", initBoard);

    initBoard();
});
