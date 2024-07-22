const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    color: 'blue'
};

let aliens = [];
let bullets = [];

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function createAlien() {
    let alien = {
        x: Math.random() * canvas.width,
        y: 0,
        width: 40,
        height: 40,
        color: 'green'
    };
    aliens.push(alien);
}

function drawAliens() {
    aliens.forEach((alien) => {
        ctx.fillStyle = alien.color;
        ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
        alien.y += 2;
    });
}

function createBullet() {
    let bullet = {
        x: player.x + player.width / 2 - 2.5,
        y: player.y,
        width: 5,
        height: 10,
        color: 'red'
    };
    bullets.push(bullet);
}

function drawBullets() {
    bullets.forEach((bullet, index) => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= 5;

        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawAliens();
    drawBullets();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft' && player.x > 0) {
        player.x -= 10;
    } else if (e.code === 'ArrowRight' && player.x < canvas.width - player.width) {
        player.x += 10;
    } else if (e.code === 'Space') {
        createBullet();
    }
});

setInterval(createAlien, 2000);
gameLoop();
