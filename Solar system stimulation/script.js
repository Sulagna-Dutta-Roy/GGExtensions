document.querySelectorAll('.planet').forEach(planet => {
    planet.addEventListener('click', () => {
        const name = planet.getAttribute('data-name');
        const info = planet.getAttribute('data-info');
        const infoBox = document.getElementById('planet-info');
        infoBox.innerHTML = `<h2>${name}</h2><p>${info}</p>`;
        infoBox.style.display = 'block';
        
        setTimeout(() => {
            infoBox.style.display = 'none';
        }, 5000); // Hide after 5 seconds
    });
});

document.getElementById('speed').addEventListener('input', event => {
    const speed = event.target.value;
    document.querySelectorAll('.orbit').forEach(orbit => {
        const baseSpeed = parseInt(orbit.getAttribute('data-base-speed'), 10);
        orbit.style.animationDuration = `${baseSpeed / (speed / 20)}s`;
    });
});

document.querySelectorAll('.orbit').forEach((orbit, index) => {
    const baseSpeed = [5, 7, 10, 15, 20, 25, 30, 35][index];
    orbit.setAttribute('data-base-speed', baseSpeed);
    orbit.style.animationDuration = `${baseSpeed}s`;
});
