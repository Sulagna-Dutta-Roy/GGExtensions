document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    let score = 0;
    let shapes = [];
    const shapeSize = 20;
    let targetShape = getRandomShape();
    
    function getRandomShape() {
      const shapes = ['circle', 'square', 'triangle'];
      return shapes[Math.floor(Math.random() * shapes.length)];
    }
    
    function drawShape(shape) {
      ctx.beginPath();
      if (shape.type === 'circle') {
        ctx.arc(shape.x, shape.y, shapeSize, 0, Math.PI * 2);
      } else if (shape.type === 'square') {
        ctx.rect(shape.x - shapeSize, shape.y - shapeSize, shapeSize * 2, shapeSize * 2);
      } else if (shape.type === 'triangle') {
        ctx.moveTo(shape.x, shape.y - shapeSize);
        ctx.lineTo(shape.x - shapeSize, shape.y + shapeSize);
        ctx.lineTo(shape.x + shapeSize, shape.y + shapeSize);
        ctx.closePath();
      }
      ctx.fillStyle = shape.color;
      ctx.fill();
    }
    
    function createShape() {
      const x = Math.random() * (canvas.width - 2 * shapeSize) + shapeSize;
      const y = -shapeSize;
      const dy = 2;
      const type = getRandomShape();
      const color = type === targetShape ? 'green' : 'red';
      return { x, y, dy, type, color };
    }
    
    function updateShapes() {
      if (Math.random() < 0.02) {
        shapes.push(createShape());
      }
      
      shapes.forEach((shape, index) => {
        shape.y += shape.dy;
        
        if (shape.y - shapeSize > canvas.height) {
          shapes.splice(index, 1);
          if (shape.type === targetShape) {
            score++;
            scoreDisplay.textContent = score;
          }
        }
      });
    }
    
    function drawShapes() {
      shapes.forEach(shape => drawShape(shape));
    }
    
    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    function updateGame() {
      clearCanvas();
      drawShapes();
      updateShapes();
      requestAnimationFrame(updateGame);
    }
    
    canvas.addEventListener('click', function(event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      shapes.forEach((shape, index) => {
        if (ctx.isPointInPath(new Path2D(), x, y)) {
          if (shape.type === targetShape) {
            shapes.splice(index, 1);
            score++;
            scoreDisplay.textContent = score;
          }
        }
      });
    });
    
    updateGame();
  });
  