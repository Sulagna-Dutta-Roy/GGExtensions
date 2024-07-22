let bulletPosition = -1;
let currentChamber = -1;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

document.getElementById('spin').addEventListener('click', () => {
    bulletPosition = getRandomInt(6);
    currentChamber = 0;
    document.getElementById('message').textContent = "Chamber spun. Ready to shoot!";
});

document.getElementById('shoot').addEventListener('click', () => {
    if (bulletPosition === -1) {
        document.getElementById('message').textContent = "Spin the chamber first!";
        return;
    }

    if (currentChamber === bulletPosition) {
        document.getElementById('message').textContent = "Bang! You're dead!";
        bulletPosition = -1; // Reset game
    } else {
        document.getElementById('message').textContent = "Click! You're safe.";
        currentChamber = (currentChamber + 1) % 6;
    }
});