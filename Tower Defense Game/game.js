// Initialize the canvas and game context
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let towers = [];
let enemies = [];
let bullets = [];

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    // Update game objects like towers, enemies, bullets
    towers.forEach(tower => tower.update());
    enemies.forEach(enemy => enemy.update());
    bullets.forEach(bullet => bullet.update());
}

function draw() {
    // Draw game objects like towers, enemies, bullets
    towers.forEach(tower => tower.draw(ctx));
    enemies.forEach(enemy => enemy.draw(ctx));
    bullets.forEach(bullet => bullet.draw(ctx));
}

canvas.addEventListener('click', (event) => {
    const x = event.offsetX;
    const y = event.offsetY;
    towers.push(new Tower(x, y));
});

gameLoop();
