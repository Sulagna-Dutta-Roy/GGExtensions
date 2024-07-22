const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin');
const resultDiv = document.getElementById('result');
const colors = ['#00386e', '#01b78f', '#f8b214', '#f94b26', '#00386e', '#01b78f', '#f8b214', '#f94b26'];
const labels = ['YES', 'NO', 'YES', 'NO', 'YES', 'NO', 'YES', 'NO'];
const slices = colors.length;
const sliceAngle = 2 * Math.PI / slices;
let startAngle = 0;
let spinTimeout = null;
let spinAngle = 0;
let spinSpeed = 0.1;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < slices; i++) {
        ctx.beginPath();
        
        ctx.fillStyle = colors[i];
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, startAngle + i * sliceAngle, startAngle + (i + 1) * sliceAngle);
        ctx.lineTo(canvas.width / 2, canvas.height / 2);
        ctx.fill();
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 5;
        ctx.stroke();
        
        ctx.save();
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#fff';
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(startAngle + (i + 0.5) * sliceAngle);
        ctx.textAlign = "center";
        ctx.fillText(labels[i], canvas.width / 3.2, 10);
        ctx.restore();
        
        ctx.beginPath();
        ctx.fillStyle = '#011d38';
        ctx.arc(canvas.width / 2, canvas.height / 2, 20, 0, 2 * Math.PI);
        ctx.fill();
    }
    drawArrow();
}


function drawArrow() {
    const arrowSize = 20;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;
    const arrowY = canvas.height;

    ctx.fillStyle = '#011d38';
    ctx.beginPath();
    ctx.moveTo(centerX - arrowSize, arrowY);
    ctx.lineTo(centerX + arrowSize, arrowY);
    ctx.lineTo(centerX, arrowY - arrowSize);
    ctx.closePath();
    ctx.fill();
}

function rotateWheel() {
    spinAngle += spinSpeed;
    startAngle += spinAngle * Math.PI / 180;
    drawWheel();
    spinSpeed *= 0.98;
    if (spinSpeed < 0.02) {
        clearTimeout(spinTimeout);
        determineResult();
    } else {
        spinTimeout = setTimeout(rotateWheel, 20);
    }
}

function determineResult() {
    const endAngle = startAngle % (2 * Math.PI);
    const index = Math.floor((slices - endAngle / sliceAngle) % slices);
    const result = labels[index];
    resultDiv.textContent = 'Result: ' + result;
}

spinBtn.addEventListener('click', () => {
    resultDiv.textContent = '';
    spinSpeed = Math.random() * 30 + 20;
    rotateWheel();
});

drawWheel();
