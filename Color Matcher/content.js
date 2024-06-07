// content.js
(function() {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  function createGameUI() {
    const gameDiv = document.createElement('div');
    gameDiv.id = 'color-matcher-game';
    gameDiv.style.position = 'fixed';
    gameDiv.style.top = '10px';
    gameDiv.style.right = '10px';
    gameDiv.style.backgroundColor = 'white';
    gameDiv.style.border = '1px solid black';
    gameDiv.style.padding = '10px';
    gameDiv.style.zIndex = '10000';
    gameDiv.innerHTML = `
      <h2>Color Matcher</h2>
      <p>Click the button to match colors!</p>
      <button id="start-game">Start Game</button>
    `;
    document.body.appendChild(gameDiv);

    document.getElementById('start-game').addEventListener('click', startGame);
  }

  function startGame() {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    alert(`Match the color: ${targetColor}`);
    
    const userColor = prompt("Enter the color:");
    
    if (userColor.toLowerCase() === targetColor) {
      alert("Correct match!");
    } else {
      alert(`Wrong match! The correct color was ${targetColor}`);
    }
  }

  createGameUI();
})();
