document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const starSize = 20;
    let score = 0;
    let stars = [];
    let player = {
      x: canvas.width / 2 - starSize / 2,
      y: canvas.height - starSize * 2,
      width: starSize,
      height: starSize,
      dx: 0
    };
  
    function drawPlayer() {
      ctx.fillStyle = 'blue';
      ctx.fillRect(player.x, player.y, player.width, player.height);
    }
  
    function drawStar(star) {
      ctx.fillStyle = 'yellow';
      ctx.beginPath();
      ctx.arc(star.x, star.y, starSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  
    function updateStars() {
      if (Math.random() < 0.02) {
        stars.push({
          x: Math.random() * (canvas.width - starSize),
          y: 0,
          dy: 2
        });
      }
  
      stars.forEach((star, index) => {
        star.y += star.dy;
  
        if (star.y > canvas.height) {
          stars.splice(index, 1);
        }
  
        if (
          star.x < player.x + player.width &&
          star.x + starSize > player.x &&
          star.y < player.y + player.height &&
          star.y + starSize > player.y
        ) {
          score++;
          scoreDisplay.textContent = score;
          stars.splice(index, 1);
        }
      });
    }
  
    function drawStars() {
      stars.forEach(star => drawStar(star));
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
      drawStars();
      updateStars();
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
  