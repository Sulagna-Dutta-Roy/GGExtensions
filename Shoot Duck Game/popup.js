document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    let score = 0;
  
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  
    class Duck {
      constructor() {
        this.width = 50;
        this.height = 30;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.speed = 2 + Math.random() * 2;
        this.direction = Math.random() * 2 * Math.PI;
      }
  
      move() {
        this.x += this.speed * Math.cos(this.direction);
        this.y += this.speed * Math.sin(this.direction);
  
        if (this.x < 0 || this.x > canvas.width - this.width) {
          this.direction = Math.PI - this.direction;
        }
        if (this.y < 0 || this.y > canvas.height - this.height) {
          this.direction = -this.direction;
        }
      }
  
      draw() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x + 15, this.y + 10, 5, 5); // eye
        ctx.fillRect(this.x + 30, this.y + 10, 10, 5); // beak
      }
  
      isHit(mouseX, mouseY) {
        return mouseX >= this.x && mouseX <= this.x + this.width &&
               mouseY >= this.y && mouseY <= this.y + this.height;
      }
    }
  
    const ducks = [];
    for (let i = 0; i < 5; i++) {
      ducks.push(new Duck());
    }
  
    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ducks.forEach(duck => {
        duck.move();
        duck.draw();
      });
      requestAnimationFrame(gameLoop);
    }
  
    canvas.addEventListener('click', function(event) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
  
      ducks.forEach((duck, index) => {
        if (duck.isHit(mouseX, mouseY)) {
          ducks.splice(index, 1);
          score += 10;
          scoreDisplay.textContent = `Score: ${score}`;
          ducks.push(new Duck());
        }
      });
    });
  
    gameLoop();
  });
  