document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const colorSize = 20;
    let score = 0;
    let colors = [];
    let player = {
      x: canvas.width / 2 - colorSize / 2,
      y: canvas.height - colorSize * 2,
      width: colorSize,
      height: colorSize,
      dx: 0
    };
  
    function drawPlayer() {
      ctx.fillStyle = 'blue';
      ctx.fillRect(player.x, player.y, player.width, player.height);
    }
  
    function drawColor(color) {
      ctx.fillStyle = color.color;
      ctx.beginPath();
      ctx.arc(color.x, color.y, colorSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  
    function updateColors() {
      if (Math.random() < 0.02) {
        const colorsArray = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];
        const randomColor = colorsArray[Math.floor(Math.random() * colorsArray.length)];
        colors.push({
          x: Math.random() * (canvas.width - colorSize),
          y: 0,
          dy: 2,
          color: randomColor
        });
      }
  
      colors.forEach((color, index) => {
        color.y += color.dy;
  
        if (color.y > canvas.height) {
          colors.splice(index, 1);
        }
  
        if (
          color.x < player.x + player.width &&
          color.x + colorSize > player.x &&
          color.y < player.y + player.height &&
          color.y + colorSize > player.y
        ) {
          score++;
          scoreDisplay.textContent = score;
          colors.splice(index, 1);
        }
      });
    }
  
    function drawColors() {
      colors.forEach(color => drawColor(color));
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
      drawColors();
      updateColors();
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
  