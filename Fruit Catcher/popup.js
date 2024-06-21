document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const fruitSize = 20;
    let score = 0;
    let fruits = [];
    let player = {
      x: canvas.width / 2 - fruitSize / 2,
      y: canvas.height - fruitSize * 2,
      width: fruitSize,
      height: fruitSize,
      dx: 0
    };
  
    function drawPlayer() {
      ctx.fillStyle = 'blue';
      ctx.fillRect(player.x, player.y, player.width, player.height);
    }
  
    function drawFruit(fruit) {
      ctx.fillStyle = 'yellow';
      ctx.beginPath();
      ctx.arc(fruit.x, fruit.y, fruitSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  
    function updateFruits() {
      if (Math.random() < 0.02) {
        fruits.push({
          x: Math.random() * (canvas.width - fruitSize),
          y: 0,
          dy: 2
        });
      }
  
      fruits.forEach((fruit, index) => {
        fruit.y += fruit.dy;
  
        if (fruit.y > canvas.height) {
          fruits.splice(index, 1);
        }
  
        if (
          fruit.x < player.x + player.width &&
          fruit.x + fruitSize > player.x &&
          fruit.y < player.y + player.height &&
          fruit.y + fruitSize > player.y
        ) {
          score++;
          scoreDisplay.textContent = score;
          fruits.splice(index, 1);
        }
      });
    }
  
    function drawFruits() {
      fruits.forEach(fruit => drawFruit(fruit));
    }
  
    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  
    function updatePlayer() {
      player.x += player.dx;
  
      if (player.x < 0) {
        player.x = 0;
      } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
      }
    }
  
    function updateGame() {
      clearCanvas();
      drawPlayer();
      drawFruits();
      updateFruits();
      updatePlayer();
      requestAnimationFrame(updateGame);
    }
  
    function movePlayer(e) {
      if (e.key === 'ArrowLeft') {
        player.dx = -5;
      } else if (e.key === 'ArrowRight') {
        player.dx = 5;
      }
    }
  
    function stopPlayer() {
      player.dx = 0;
    }
  
    document.addEventListener('keydown', movePlayer);
    document.addEventListener('keyup', stopPlayer);
  
    updateGame();
  });
  