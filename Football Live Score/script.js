document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'https://api.soccersapi.com/v2.2/livescores/?user=gabaniyash847&token=7e4a5c820e72104fc7362a33473d7f69&t=today';
    const scoresContainer = document.getElementById('scores-container');

    function fetchLiveScores() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                scoresContainer.innerHTML = '';

                data.data.forEach(match => {
                    const matchElement = document.createElement('div');
                    matchElement.classList.add('match');

                    const homeTeam = document.createElement('div');
                    homeTeam.classList.add('team');
                    homeTeam.innerHTML = `<img src="${match.teams.home.img}" alt="${match.teams.home.name}"> ${match.teams.home.name}`;

                    const awayTeam = document.createElement('div');
                    awayTeam.classList.add('team');
                    awayTeam.innerHTML = `<img src="${match.teams.away.img}" alt="${match.teams.away.name}"> ${match.teams.away.name}`;

                    const score = document.createElement('div');
                    score.innerHTML = `<strong>${match.scores.home_score} - ${match.scores.away_score}</strong>`;

                    const matchDetails = document.createElement('div');
                    matchDetails.classList.add('score-details');
                    matchDetails.innerHTML = `
                        <p>Status: ${match.status_name}</p>
                        <p>Date: ${match.time.date}</p>
                        <p>Time: ${match.time.time}</p>
                    `;

                    matchElement.appendChild(homeTeam);
                    matchElement.appendChild(score);
                    matchElement.appendChild(awayTeam);
                    matchElement.appendChild(matchDetails);

                    scoresContainer.appendChild(matchElement);
                });
            })
            .catch(error => console.log('Error fetching live scores:', error));
    }

    fetchLiveScores();
    setInterval(fetchLiveScores, 30000);
});