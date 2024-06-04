const target = document.getElementById('target');
const scoreDisplay = document.getElementById('score');
const gameContainer = document.querySelector('.game-container');
const audio = document.getElementById('audio'); // Ses öğesi
const bgAudio = document.getElementById('bgAudio');

let score = 0;
let timeLeft = 60; // 1 dakika (60 saniye)

function updateScore() {
  scoreDisplay.textContent = `Score: ${score} - Duration: ${formatTime(timeLeft)}`;
}

function generateRandomPosition() {
  const maxX = gameContainer.clientWidth - target.clientWidth;
  const maxY = gameContainer.clientHeight - target.clientHeight;
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);
  return { x: randomX, y: randomY };
}

function moveTargetRandomly() {
  const newPosition = generateRandomPosition();
  target.style.left = `${newPosition.x}px`;
  target.style.top = `${newPosition.y}px`;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

function updateTime() {
  timeLeft--;
  updateScore();
  if (timeLeft <= 0) {
    clearInterval(gameInterval);
    target.removeEventListener('click', handleTargetClick);
    scoreDisplay.textContent = `Oyun Bitti! Skor: ${score} - Süre: 0:00`;
  }
}

// Müziği çal/durdur
function toggleBackgroundMusic() {
  if (bgAudio.paused) {
      bgAudio.play();
    } else {
      bgAudio.pause();
    }
}

function handleTargetClick() {
  score++;
  moveTargetRandomly();
  updateScore();
  playSound();
}

function playSound() {
    audio.currentTime = 0; // Sesin başa sarılmasını sağlar
    audio.play(); // Ses çal
}

function handleGameContainerClick(event) {
    if (event.target === gameContainer) {
      score--;
      updateScore();
      playSound2(); // İkinci sesi çal
    }
}

function playSound2() {
    audio2.currentTime = 0; // Sesin başa sarılmasını sağlar
    audio2.play(); // İkinci sesi çal
}

updateScore();
moveTargetRandomly();
gameContainer.addEventListener('click', handleGameContainerClick);

const gameInterval = setInterval(updateTime, 1000);
target.addEventListener('click', handleTargetClick);