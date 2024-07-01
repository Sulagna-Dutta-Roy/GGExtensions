
// script2.js

const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let animationId;
let particles = [];

const magnet = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 20,
    height: 100
};

function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
}

Particle.prototype.update = function() {
    const dx = this.x - magnet.x;
    const dy = this.y - magnet.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const force = 100 / (dist * dist);

    const fx = force * dx / dist;
    const fy = force * dy / dist;

    this.vx -= fx;
    this.vy -= fy;

    this.x += this.vx;
    this.y += this.vy;
};

Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#1abc9c';
    ctx.fill();
};

function initParticles() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        const angle = Math.PI * 2 * Math.random();
        const radius = Math.random() * 150 + 50;
        const x = magnet.x + Math.cos(angle) * radius;
        const y = magnet.y + Math.sin(angle) * radius;
        particles.push(new Particle(x, y));
    }
}

function drawMagnet() {
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(magnet.x - magnet.width / 2, magnet.y - magnet.height / 2, magnet.width, magnet.height);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMagnet();
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
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
    initParticles();
    animate();
}

startBtn.addEventListener('click', startSimulation);
stopBtn.addEventListener('click', stopSimulation);
resetBtn.addEventListener('click', resetSimulation);

resetSimulation();
