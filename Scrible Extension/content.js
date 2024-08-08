let isDrawing = false;
let x = 0;
let y = 0;

const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '10000';
canvas.style.pointerEvents = 'none';

const context = canvas.getContext('2d');
document.body.appendChild(canvas);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

document.addEventListener('mousedown', (e) => {
  isDrawing = true;
  x = e.clientX;
  y = e.clientY;
});

document.addEventListener('mousemove', (e) => {
  if (isDrawing) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(e.clientX, e.clientY);
    context.strokeStyle = 'red';
    context.lineWidth = 2;
    context.stroke();
    context.closePath();
    x = e.clientX;
    y = e.clientY;
  }
});

document.addEventListener('mouseup', () => {
  isDrawing = false;
});

document.addEventListener('mouseleave', () => {
  isDrawing = false;
});
