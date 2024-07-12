const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const angleSlider = document.getElementById('angle');
const lengthSlider = document.getElementById('length');
const depthSlider = document.getElementById('depth');
const color1Picker = document.getElementById('color1');
const color2Picker = document.getElementById('color2');
const animateCheckbox = document.getElementById('animate');

let animationFrameId;

function drawTree(startX, startY, length, angle, depth, branchWidth, color1, color2) {
    if (depth === 0) return;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    const endX = startX + length * Math.cos(angle * Math.PI / 180);
    const endY = startY + length * Math.sin(angle * Math.PI / 180);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = depth > 2 ? color1 : color2;
    ctx.lineWidth = branchWidth;
    ctx.stroke();

    drawTree(endX, endY, length * 0.7, angle - parseInt(angleSlider.value) + Math.random() * 10 - 5, depth - 1, branchWidth * 0.7, color1, color2);
    drawTree(endX, endY, length * 0.7, angle + parseInt(angleSlider.value) + Math.random() * 10 - 5, depth - 1, branchWidth * 0.7, color1, color2);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const length = parseInt(lengthSlider.value);
    const depth = parseInt(depthSlider.value);
    const color1 = color1Picker.value;
    const color2 = color2Picker.value;
    drawTree(canvas.width / 2, canvas.height, length, -90, depth, length / 10, color1, color2);
}

function animate() {
    draw();
    if (animateCheckbox.checked) {
        animationFrameId = requestAnimationFrame(animate);
    } else {
        cancelAnimationFrame(animationFrameId);
    }
}

angleSlider.addEventListener('input', animate);
lengthSlider.addEventListener('input', animate);
depthSlider.addEventListener('input', animate);
color1Picker.addEventListener('input', animate);
color2Picker.addEventListener('input', animate);
animateCheckbox.addEventListener('input', animate);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
});

draw();
animate();
