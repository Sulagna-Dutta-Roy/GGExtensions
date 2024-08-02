const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const frequencySlider = document.getElementById('frequencySlider');
const amplitudeSlider = document.getElementById('amplitudeSlider');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let animationId;
let time = 0;
let frequency = 1.0;
let amplitude = 50;

function drawWave(x, y, offset) {
    ctx.beginPath();
    for (let i = 0; i < canvas.width; i++) {
        const waveY = y + Math.sin((i + time * 10 + offset) * frequency) * amplitude;
        ctx.lineTo(i, waveY);
    }
    ctx.strokeStyle = '#ecf0f1';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawInterference() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawWave(0, canvas.height / 2 - amplitude, 0);
    drawWave(0, canvas.height / 2 + amplitude, Math.PI);

    for (let i = 0; i < canvas.width; i++) {
        const y1 = Math.sin((i + time * 10) * frequency) * amplitude;
        const y2 = Math.sin((i + time * 10 + Math.PI) * frequency) * amplitude;
        const y = canvas.height / 2 + (y1 + y2) / 2;
        ctx.beginPath();
        ctx.arc(i, y, 1, 0, Math.PI * 2);
        ctx.fillStyle = '#1abc9c';
        ctx.fill();
        ctx.closePath();
    }

    time += 0.01;
}

function animate() {
    drawInterference();
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
    time = 0;
    frequency = 1.0;
    amplitude = 50;
    frequencySlider.value = frequency;
    amplitudeSlider.value = amplitude;
    drawInterference();
}

frequencySlider.addEventListener('input', (e) => {
    frequency = e.target.value;
    drawInterference();
});

amplitudeSlider.addEventListener('input', (e) => {
    amplitude = e.target.value;
    drawInterference();
});

startBtn.addEventListener('click', startSimulation);
stopBtn.addEventListener('click', stopSimulation);
resetBtn.addEventListener('click', resetSimulation);

resetSimulation();
