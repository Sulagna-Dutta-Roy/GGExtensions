document.addEventListener('DOMContentLoaded', () => {
    const mazeElement = document.getElementById('maze');

    const walls = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 200, y: 0 },
        // Add more walls here
    ];

    walls.forEach(wall => {
        const wallElement = document.createElement('div');
        wallElement.className = 'wall';
        wallElement.style.transform = `translateX(${wall.x}px) translateY(${wall.y}px)`;
        mazeElement.appendChild(wallElement);
    });

    const playerElement = document.createElement('div');
    playerElement.className = 'player';
    mazeElement.appendChild(playerElement);

    let playerPosition = { x: 0, y: 0 };

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp':
                playerPosition.y -= 10;
                break;
            case 'ArrowDown':
                playerPosition.y += 10;
                break;
            case 'ArrowLeft':
                playerPosition.x -= 10;
                break;
            case 'ArrowRight':
                playerPosition.x += 10;
                break;
        }
        playerElement.style.transform = `translateX(${playerPosition.x}px) translateY(${playerPosition.y}px) translateZ(50px)`;
    });
});
