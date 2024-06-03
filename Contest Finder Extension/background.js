// background.js
async function fetchContests() {
    const codeforces = await fetch('https://codeforces.com/api/contest.list')
        .then(response => response.json())
        .then(data => data.result.filter(contest => contest.phase === 'BEFORE'));

    // Fetch from other APIs similarly

    // Combine all contests
    const contests = [...codeforces /*, ...otherContestSources */];

    return contests;
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ contests: [] });
    updateContests();
});

function updateContests() {
    fetchContests().then(contests => {
        chrome.storage.local.set({ contests });
    });
}

// Update contests periodically
setInterval(updateContests, 60 * 60 * 1000); // Every hour
