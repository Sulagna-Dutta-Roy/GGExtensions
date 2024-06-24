document.addEventListener('DOMContentLoaded', () => {
    const playerList = document.getElementById('player-list');
    const playMatchButton = document.getElementById('play-match');
    const viewStatsButton = document.getElementById('view-stats');

    // Mock data for players
    const players = [
        { name: 'Player 1', position: 'Forward', skill: 85 },
        { name: 'Player 2', position: 'Midfielder', skill: 80 },
        { name: 'Player 3', position: 'Defender', skill: 78 },
        { name: 'Player 4', position: 'Goalkeeper', skill: 83 },
    ];

    // Display players
    players.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = `${player.name} - ${player.position} (Skill: ${player.skill})`;
        playerList.appendChild(listItem);
    });

    // Handle Play Match button click
    playMatchButton.addEventListener('click', () => {
        const matchResult = Math.random() > 0.5 ? 'Win' : 'Lose';
        alert(`Match Result: ${matchResult}`);
    });

    // Handle View Stats button click
    viewStatsButton.addEventListener('click', () => {
        const averageSkill = players.reduce((acc, player) => acc + player.skill, 0) / players.length;
        alert(`Average Skill: ${averageSkill.toFixed(2)}`);
    });
});
