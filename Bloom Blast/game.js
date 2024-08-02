let grid = [];
let score = 0;

// generate grid cells
for (let i = 0; i < 4; i++) {
  grid[i] = [];
  for (let j = 0; j < 4; j++) {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    cell.dataset.row = i;
    cell.dataset.col = j;
    grid[i][j] = cell;
    document.querySelector(".grid-container").appendChild(cell);
  }
}

// set initial flower colors
for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    const color = getRandomColor();
    grid[i][j].style.backgroundColor = color;
    grid[i][j].classList.add("flower", color);
  }
}

// game logic
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".grid-container").addEventListener("click", function (event) {
    if (event.target.classList.contains("grid-cell")) {
      const row = event.target.dataset.row;
      const col = event.target.dataset.col;
      bloomFlowers(row, col);
    }
  });
});

function getRandomColor() {
  const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function bloomFlowers(row, col) {
  const flowerColor = grid[row][col].classList[1];
  let bloomCount = 0;

  // check adjacent flowers
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const adjacentRow = row + i;
      const adjacentCol = col + j;
      if (adjacentRow >= 0 && adjacentRow < 4 && adjacentCol >= 0 && adjacentCol < 4) {
        const adjacentFlower = grid[adjacentRow][adjacentCol];
        if (adjacentFlower.classList.contains(flowerColor)) {
          bloomCount++;
          adjacentFlower.classList.add("bloom");
        }
      }
    }
  }

  // update score
  score += bloomCount;
  document.querySelector("#score").textContent = score;

  // remove bloomed flowers
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j].classList.contains("bloom")) {
        grid[i][j].classList.remove("flower", flowerColor, "bloom");
        grid[i][j].style.backgroundColor = "#fff";
      }
    }
  }
}