const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const simulationType = document.getElementById('simulationType');
const addBallBtn = document.getElementById('addBallBtn');
const removeBallBtn = document.getElementById('removeBallBtn');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let animationId;
const gravity = 0.1;
const friction = 0.99;
let balls = [];

class Ball {
    constructor(x, y, dx, dy, radius, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.color = color;
        this.shadowColor = color.replace(")", ", 0.5)").replace("rgb", "rgba");
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(this.x, this.y, this.radius * 0.3, this.x, this.y, this.radius);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(1, this.color);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.shadowColor = this.shadowColor;
        ctx.shadowBlur = 20;
        ctx.closePath();
    }

    update(gravityEnabled, frictionEnabled) {
        if (this.y + this.radius + this.dy > canvas.height) {
            this.dy = -this.dy * (frictionEnabled ? friction : 1);
        } else {
            this.dy += gravityEnabled ? gravity : 0;
        }

        if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx * (frictionEnabled ? friction : 1);
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

function initBalls() {
    balls = [];
    for (let i = 0; i < 10; i++) {
        addBall();
    }
}

function addBall() {
    const radius = 20;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    const dx = (Math.random() - 0.5) * 4;
    const dy = (Math.random() - 0.5) * 4;
    const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    balls.push(new Ball(x, y, dx, dy, radius, color));
}

function removeBall() {
    balls.pop();
}

function detectCollisions() {
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const dx = balls[i].x - balls[j].x;
            const dy = balls[i].y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < balls[i].radius + balls[j].radius) {
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                const [x1, y1, x2, y2] = [0, 0, dx * cos + dy * sin, dy * cos - dx * sin];

                const vx1 = balls[i].dx * cos + balls[i].dy * sin;
                const vy1 = balls[i].dy * cos - balls[i].dx * sin;
                const vx2 = balls[j].dx * cos + balls[j].dy * sin;
                const vy2 = balls[j].dy * cos - balls[j].dx * sin;

                const vx1Final = ((balls[i].radius - balls[j].radius) * vx1 + 2 * balls[j].radius * vx2) / (balls[i].radius + balls[j].radius);
                const vx2Final = ((balls[j].radius - balls[i].radius) * vx2 + 2 * balls[i].radius * vx1) / (balls[i].radius + balls[j].radius);

                balls[i].dx = vx1Final * cos - vy1 * sin;
                balls[i].dy = vy1 * cos + vx1Final * sin;
                balls[j].dx = vx2Final * cos - vy2 * sin;
                balls[j].dy = vy2 * cos + vx2Final * sin;

                balls[i].x += balls[i].dx;
                balls[i].y += balls[i].dy;
                balls[j].x += balls[j].dx;
                balls[j].y += balls[j].dy;
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gravityEnabled = simulationType.value === 'gravity';
    const frictionEnabled = simulationType.value !== 'frictionless';

    balls.forEach(ball => ball.update(gravityEnabled, frictionEnabled));
    detectCollisions();

    animationId = requestAnimationFrame(animate);
}

function startSimulation() {
    if (!animationId) {
        animate();
    }
}

function stopSimulation() {
    cancelAnimationFrame(animationId);
    animationId = null;
}

function resetSimulation() {
    stopSimulation();
    initBalls();
    startSimulation();
}

startBtn.addEventListener('click', startSimulation);
stopBtn.addEventListener('click', stopSimulation);
resetBtn.addEventListener('click', resetSimulation);
simulationType.addEventListener('change', resetSimulation);
addBallBtn.addEventListener('click', addBall);
removeBallBtn.addEventListener('click', removeBall);

initBalls();
