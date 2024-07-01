const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const BALL_RADIUS = 20;
const GRAVITY = 0.5;
const BALL_COLORS = ['#FF5733', '#33FF57', '#5733FF'];
const MAX_BALLS = 20; // Maximum balls allowed on screen
const COLLISION_DAMPING = 0.8; // Energy loss on collision

let balls = [];
let score = 0;
let level = 1;
let isPaused = false;
let obstacles = [];

class Ball {
  constructor(x, y, dx, dy, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.dy += GRAVITY;

    // Check collision with walls
    if (this.x + this.dx > canvas.width - BALL_RADIUS || this.x + this.dx < BALL_RADIUS) {
      this.dx = -this.dx;
    }

    // Check collision with bottom boundary
    if (this.y + this.dy > canvas.height - BALL_RADIUS || this.y + this.dy < BALL_RADIUS) {
      this.dy = -this.dy * COLLISION_DAMPING;
    }
  }
}

class Obstacle {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  checkCollision(ball) {
    // Check if ball collides with this obstacle
    return ball.x + BALL_RADIUS > this.x &&
           ball.x - BALL_RADIUS < this.x + this.width &&
           ball.y + BALL_RADIUS > this.y &&
           ball.y - BALL_RADIUS < this.y + this.height;
  }
}

function createRandomBall() {
  const x = Math.random() * (canvas.width - BALL_RADIUS * 2) + BALL_RADIUS;
  const y = Math.random() * (canvas.height - BALL_RADIUS * 2) + BALL_RADIUS;
  const dx = Math.random() * 4 - 2; // Random horizontal speed
  const dy = Math.random() * 4 - 2; // Random vertical speed
  const color = BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)];
  return new Ball(x, y, dx, dy, color);
}

function createObstacles() {
  // Example of creating obstacles - customize as needed
  obstacles.push(new Obstacle(200, 300, 100, 20, '#777777'));
  obstacles.push(new Obstacle(400, 200, 20, 150, '#777777'));
}

function checkBallCollision(ball1, ball2) {
  const dx = ball1.x - ball2.x;
  const dy = ball1.y - ball2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < BALL_RADIUS * 2;
}

function updateGameArea() {
  if (!isPaused) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create new balls randomly
    if (balls.length < MAX_BALLS && Math.random() < 0.03) {
      balls.push(createRandomBall());
    }

    // Update and draw each ball
    balls.forEach((ball, index) => {
      ball.update();
      ball.draw();

      // Check collision with obstacles
      obstacles.forEach(obstacle => {
        if (obstacle.checkCollision(ball)) {
          ball.dx = -ball.dx;
          ball.dy = -ball.dy;
        }
      });

      // Check collision with other balls
      for (let i = index + 1; i < balls.length; i++) {
        if (checkBallCollision(ball, balls[i])) {
          // Handle collision - exchange velocities
          const tempDx = ball.dx;
          const tempDy = ball.dy;
          ball.dx = balls[i].dx * COLLISION_DAMPING;
          ball.dy = balls[i].dy * COLLISION_DAMPING;
          balls[i].dx = tempDx * COLLISION_DAMPING;
          balls[i].dy = tempDy * COLLISION_DAMPING;
        }
      }

      // Check if ball leaves canvas and remove it
      if (ball.x < -BALL_RADIUS || ball.x > canvas.width + BALL_RADIUS ||
          ball.y < -BALL_RADIUS || ball.y > canvas.height + BALL_RADIUS) {
        balls.splice(index, 1);
      }
    });

    // Draw obstacles
    obstacles.forEach(obstacle => obstacle.draw());

    // Update score and level based on number of balls on screen
    score = balls.length;
    level = Math.ceil(score / 10); // Example: increase level every 10 balls

    // Display score and level
    ctx.fillStyle = '#000000';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score} | Level: ${level}`, 10, 30);

    requestAnimationFrame(updateGameArea);
  }
}

function startGame() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.9;
  balls = [];
  obstacles = [];
  createObstacles();
  updateGameArea();
}

function togglePause() {
  isPaused = !isPaused;
  if (!isPaused) {
    updateGameArea();
  }
}

// Event listeners for user controls
window.onload = startGame;
window.addEventListener('keydown', (e) => {
  if (e.key === ' ') { // Spacebar to pause/resume game
    togglePause();
  } else if (e.key === 'r') { // 'R' key to restart game
    startGame();
  }
});

// Responsive design: Resize canvas on window resize
window.addEventListener('resize', () => {
  if (!isPaused) {
    startGame(); // Restart the game to adjust canvas size
  }
});
