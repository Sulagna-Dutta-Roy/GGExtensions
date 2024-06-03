// popup.js
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['contests'], (result) => {
        const contests = result.contests || [];
        const contestList = document.getElementById('contest-list');

        contests.forEach(contest => {
            const contestElement = document.createElement('div');
            contestElement.className = 'contest';
            contestElement.innerHTML = `
          <strong>${contest.id} . ${contest.name}</strong><br>
          <a href="https://codeforces.com/contests/${contest.id}" target="_blank" id="reg-link">Register</a><br>
          Start Time: ${new Date(contest.startTimeSeconds * 1000).toLocaleString()}
        `;
            contestList.appendChild(contestElement);
        });
    });
});
