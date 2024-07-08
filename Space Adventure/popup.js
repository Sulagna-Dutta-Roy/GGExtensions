const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const spaceship = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 50,
  height: 50,
  speed: 5
};

let asteroids = [];
let score = 0;

function drawSpaceship() {
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function drawAsteroids() {
  asteroids.forEach((asteroid, index) => {
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(asteroid.x, asteroid.y, asteroid.width, asteroid.height);
  });
}

function moveSpaceship(direction) {
  if (direction === 'left' && spaceship.x > 0) {
    spaceship.x -= spaceship.speed;
  } else if (direction === 'right' && spaceship.x < canvas.width - spaceship.width) {
    spaceship.x += spaceship.speed;
  }
}

function generateAsteroid() {
  const asteroid = {
    x: Math.random() * (canvas.width - 30),
    y: -30,
    width: 30,
    height: 30,
    speed: Math.random() * 4 + 2
  };
  asteroids.push(asteroid);
}

function updateAsteroids() {
  asteroids.forEach((asteroid, index) => {
    asteroid.y += asteroid.speed;

    if (asteroid.y > canvas.height) {
      asteroids.splice(index, 1);
      score++;
      document.getElementById('scoreValue').textContent = score;
    }

    if (
      spaceship.x < asteroid.x + asteroid.width &&
      spaceship.x + spaceship.width > asteroid.x &&
      spaceship.y < asteroid.y + asteroid.height &&
      spaceship.y + spaceship.height > asteroid.y
    ) {
      alert('Game Over! Your score: ' + score);
      score = 0;
      document.getElementById('scoreValue').textContent = score;
      asteroids = [];
    }
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawSpaceship();
  drawAsteroids();
  updateAsteroids();

  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowLeft') {
    moveSpaceship('left');
  } else if (event.key === 'ArrowRight') {
    moveSpaceship('right');
  }
});

setInterval(generateAsteroid, 1000);
gameLoop();
