document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const circleRadius = 20;
    let score = 0;
    let circles = [];
  
    function createCircle() {
      const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const x = Math.random() * (canvas.width - 2 * circleRadius) + circleRadius;
      const y = Math.random() * (canvas.height - 2 * circleRadius) + circleRadius;
      const dx = (Math.random() - 0.5) * 2;
      const dy = (Math.random() - 0.5) * 2;
      return { x, y, dx, dy, color };
    }
  
    function drawCircle(circle) {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circleRadius, 0, Math.PI * 2);
      ctx.fillStyle = circle.color;
      ctx.fill();
      ctx.closePath();
    }
  
    function updateCircles() {
      circles.forEach(circle => {
        circle.x += circle.dx;
        circle.y += circle.dy;
  
        if (circle.x - circleRadius < 0 || circle.x + circleRadius > canvas.width) {
          circle.dx = -circle.dx;
        }
  
        if (circle.y - circleRadius < 0 || circle.y + circleRadius > canvas.height) {
          circle.dy = -circle.dy;
        }
      });
    }
  
    function drawCircles() {
      circles.forEach(circle => drawCircle(circle));
    }
  
    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  
    function updateGame() {
      clearCanvas();
      updateCircles();
      drawCircles();
      requestAnimationFrame(updateGame);
    }
  
    canvas.addEventListener('click', function(event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
  
      circles.forEach((circle, index) => {
        const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
        if (distance < circleRadius) {
          circles.splice(index, 1);
          score++;
          scoreDisplay.textContent = score;
          circles.push(createCircle());
        }
      });
    });
  
    for (let i = 0; i < 5; i++) {
      circles.push(createCircle());
    }
  
    updateGame();
  });
  