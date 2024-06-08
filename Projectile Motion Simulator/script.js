document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#start").addEventListener('click', startSimulation)
})

function startSimulation() {

    const canvas = document.getElementById('simulationCanvas');
    const ctx = canvas.getContext('2d');
    const velocity = parseFloat(document.getElementById('velocity').value);
    const angle = parseFloat(document.getElementById('angle').value) * (Math.PI / 180); // Convert to radians
    const gravity = parseFloat(document.getElementById('gravity').value);

    if (!velocity)  {
        alert("Velocity is required!")
        return
    }
    if (!angle)  {
        alert("Angle is required!")
        return
    }
    if (velocity < 0 || angle < 0) {
        alert("Values for angle and velocity cannot be negative!")
        return
    }

    canvas.width = 500;
    canvas.height = 200;

    const initialX = 50;
    const initialY = canvas.height - 50;
    const timeIncrement = 0.05;

    let time = 0;
    let maxHeight = (Math.pow(velocity, 2) * Math.pow(Math.sin(angle), 2)) / (2 * gravity);
    let timeOfFlight = (2 * velocity * Math.sin(angle)) / gravity;
    let range = (Math.pow(velocity, 2) * Math.sin(2 * angle)) / gravity;

    document.getElementById('maxHeight').textContent = maxHeight.toFixed(2);
    document.getElementById('timeOfFlight').textContent = timeOfFlight.toFixed(2);
    document.getElementById('range').textContent = range.toFixed(2);

    let positions = [];

    function drawProjectile() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let x = initialX + velocity * Math.cos(angle) * time;
        let y = initialY - (velocity * Math.sin(angle) * time - 0.5 * gravity * Math.pow(time, 2));

        if (y > canvas.height - 50) {
            y = canvas.height - 50;
        }

        positions.push({x, y});

        // Draw the path
        ctx.beginPath();
        for (let i = 0; i < positions.length - 1; i++) {
            ctx.moveTo(positions[i].x, positions[i].y);
            ctx.lineTo(positions[i + 1].x, positions[i + 1].y);
        }
        ctx.strokeStyle = '#000000';
        ctx.stroke();

        // Draw the projectile
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#FF0000';
        ctx.fill();

        if (time < timeOfFlight) {
            time += timeIncrement;
            requestAnimationFrame(drawProjectile);
        }
    }

    drawProjectile();
}
