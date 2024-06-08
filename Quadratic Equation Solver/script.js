const input_a = document.getElementById('a');
const input_b = document.getElementById('b');
const input_c = document.getElementById('c');
const roots = document.getElementById("roots");
const turning_point = document.getElementById("turning-point");
const symmetry = document.getElementById("symmetry");
const canvas = document.getElementById('graphCanvas');
let ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("solve").addEventListener("click", solveQuadratic)
    document.getElementById('clear').addEventListener('click', clearAll);
})

function solveQuadratic() {

    const a = parseFloat(input_a.value);
    const b = parseFloat(input_b.value);
    const c = parseFloat(input_c.value);

    if (!a || !b || !c) {
        alert("Please fill all the fields a, b and n!")
        return
    }
    
    const discriminant = b * b - 4 * a * c;

    let vertexX, vertexY;
    let root1 = 0, root2 = 0;

    if (discriminant > 0) {
        root1 = ((-b + Math.sqrt(discriminant)) / (2 * a)).toFixed(2);
        root2 = ((-b - Math.sqrt(discriminant)) / (2 * a)).toFixed(2);
    } else if (discriminant === 0) {
        root1 = (-b / (2 * a)).toFixed(2);
        root2 = root1;
    } else {
        const realPart = (-b / (2 * a)).toFixed(2);
        const imaginaryPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(2);
        root1 = `${realPart} + ${imaginaryPart}i`;
        root2 = `${realPart} - ${imaginaryPart}i`
    }
    roots.innerHTML = `x<sub>1</sub> = ${root1} , x<sub>2</sub> = ${root2}`;

    vertexX = -b / (2 * a);
    vertexY = a * vertexX * vertexX + b * vertexX + c;

    turning_point.innerHTML = `( ${vertexX.toFixed(2)} , ${vertexY.toFixed(2)} )`;
    symmetry.innerHTML = `x = ${vertexX.toFixed(2)}`;

    drawGraph(a, b, c, vertexX, vertexY);
}


function drawGraph(a, b, c, vertexX, vertexY) {

    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.strokeStyle = '#FFF';
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#000000';

    const xRange = width / 2;
    const yRange = height / 2;
    const xMax = Math.max(Math.abs(vertexX) * 2, Math.abs(b) + 10); // Adjusted to include vertex and intercepts
    const yMax = Math.max(Math.abs(c) + 10, Math.abs(vertexY)); // Adjusted to include vertex and intercepts
    const scaleX = xRange / xMax;
    const scaleY = yRange / yMax;
    const scale = Math.min(scaleX, scaleY);

    for (let x = -xRange; x < xRange; x += 0.1) {
        const y = a * x * x + b * x + c;
        ctx.lineTo(width / 2 + x * scale, height / 2 - y * scale);
    }
    ctx.stroke();

    // Display vertex
    ctx.beginPath();
    ctx.arc(width / 2 + vertexX * scale, height / 2 - vertexY * scale, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#00ff00';
    ctx.fill();
}

function clearAll() {
    input_a.value = ""
    input_b.value = ""
    input_c.value = ""
    roots.innerHTML = ``
    turning_point.innerHTML = ``
    symmetry.innerHTML = ``
    ctx.clearRect(0, 0, width, height);
}

