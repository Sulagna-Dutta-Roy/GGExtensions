// Variables
let playerPosition = { x: 50, y: 50 };
let zombiePosition = { x: 300, y: 300 };
let score = 0;
let gameActive = true; // Flag to track if the game is active

const player = document.getElementById('player');
const zombie = document.getElementById('zombie');
const gameContainer = document.querySelector('.game-container'); // Reference to the game container element
const scoreValue = document.getElementById('score-value');

// Update player position
function movePlayer(x, y) {
  if (!gameActive) return; // Stop player movement if game over
  
  // Calculate new position
  let newX = playerPosition.x + x;
  let newY = playerPosition.y + y;
  
  // Check boundaries
  if (newX >= 0 && newX <= gameContainer.clientWidth - player.offsetWidth) {
    playerPosition.x = newX;
  }
  if (newY >= 0 && newY <= gameContainer.clientHeight - player.offsetHeight) {
    playerPosition.y = newY;
  }
  
  // Update player position on screen
  player.style.left = playerPosition.x + 'px';
  player.style.top = playerPosition.y + 'px';
}

// Update zombie position
function moveZombie() {
  if (!gameActive) return; // Stop zombie movement if game over

  let dx = playerPosition.x - zombiePosition.x;
  let dy = playerPosition.y - zombiePosition.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance > 0) {
    let speed =3.5; // adjust speed as needed
    zombiePosition.x += (dx / distance) * speed;
    zombiePosition.y += (dy / distance) * speed;
    zombie.style.left = zombiePosition.x + 'px';
    zombie.style.top = zombiePosition.y + 'px';
  }
  
  // Check if zombie reaches player
  if (distance < 15) {
    gameOver();
  }
}

// Game over function
function gameOver() {
  gameActive = false; // Set game to inactive
  alert('Game Over! Final score: ' + score);
  zombie.setAttribute('src','./asset/zombie1.png') 
  resetGame();
}

// Function to reset the game
function resetGame() {
  gameActive = true; // Set game to active

  // Reset positions
  playerPosition = { x: 50, y: 50 };
  zombiePosition = { x: 300, y: 300 };

  // Reset score
  score = 0;
  scoreValue.textContent = score;

  // Reset player and zombie positions on the screen
  player.style.left = playerPosition.x + 'px';
  player.style.top = playerPosition.y + 'px';
  zombie.style.left = zombiePosition.x + 'px';
  zombie.style.top = zombiePosition.y + 'px';
}

// Main game loop
setInterval(function() {
  moveZombie();
  
  // Check if zombie hasn't reached player position in 5 seconds
  setTimeout(function() {
    if (gameActive) { // Only increase score if game is active
      score += 10;
      scoreValue.textContent = score;
      if(score>1000 && !zombie.classList.contains('zombie2')){
        zombie.setAttribute('src','./asset/zombie2.png')
        zombie.classList.add('zombie2')
  }  
  if(score>2000 && !zombie.classList.contains('zombie3')){
    zombie.setAttribute('src','./asset/zombie3.png')
    zombie.classList.add('zombie3')
}  
      if(score>3000 && !zombie.classList.contains('zombie4')){
        zombie.setAttribute('src','./asset/zombie4.png')
        zombie.classList.add('zombie4')
  }  
      if(score>4000 && !zombie.classList.contains('zombie5')){
            zombie.setAttribute('src','./asset/zombie5.png')
            zombie.classList.add('zombie5')
      } 
    }
  }, 5000);
}, 100); // adjust interval as needed

// Event listeners for player movement
let ArrowLeftIcon=document.getElementById('Left-control')
let ArrowTopIcon=document.getElementById('top_cotroller')
let ArrowBottomIcon=document.getElementById('bottom_cotroller')
let ArrowRightIcon=document.getElementById('right_cotroller') 
ArrowLeftIcon.addEventListener('click',()=>{ movePlayer(-5, 0);})
ArrowTopIcon.addEventListener('click',()=>{movePlayer(0, -5);})
ArrowBottomIcon.addEventListener('click',()=>{movePlayer(0, 5);})
ArrowRightIcon.addEventListener('click',()=>{movePlayer(5, 0);})
document.addEventListener('keydown', function(event) {
  if (!gameActive) return; // Stop player movement if game over
  
  switch(event.key) {
    case 'ArrowUp':
      movePlayer(0, -5);
      break;
    case 'ArrowDown':
      movePlayer(0, 5);
      break;
    case 'ArrowLeft':
      movePlayer(-5, 0);
      break;
    case 'ArrowRight':
      movePlayer(5, 0);
      break;
  }
});
