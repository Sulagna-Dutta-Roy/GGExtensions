document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const ballRadius = 10;
    let score = 0;
    let balls = [];
    let player = {
      x: canvas.width / 2 - 25,
      y: canvas.height - 30,
      width: 50,
      height: 10,
      dx: 0
    };
  
    function drawPlayer() {
      ctx.fillStyle = 'blue';
      ctx.fillRect(player.x, player.y, player.width, player.height);
    }
  
    function createBall() {
      const x = Math.random() * (canvas.width - 2 * ballRadius) + ballRadius;
      const y = -ballRadius;
      const dy = 2;
      return { x, y, dy };
    }
  
    function drawBall(ball) {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.closePath();
    }
  
    function updateBalls() {
      if (Math.random() < 0.02) {
        balls.push(createBall());
      }
  
      balls.forEach((ball, index) => {
        ball.y += ball.dy;
  
        if (ball.y - ballRadius > canvas.height) {
          balls.splice(index, 1);
          score++;
          scoreDisplay.textContent = score;
        }
  
        if (
          ball.x > player.x &&
          ball.x < player.x + player.width &&
          ball.y + ballRadius > player.y
        ) {
          alert('Game Over! Your final score is: ' + score);
          document.location.reload();
        }
      });
    }
  
    function drawBalls() {
      balls.forEach(ball => drawBall(ball));
    }
  
    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  
    function updateGame() {
      clearCanvas();
      drawPlayer();
      drawBalls();
      updateBalls();
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
  
    function updatePlayer() {
      player.x += player.dx;
  
      if (player.x < 0) {
        player.x = 0;
      } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
      }
    }
  
    document.addEventListener('keydown', movePlayer);
    document.addEventListener('keyup', stopPlayer);
  
    updateGame();
  });
  