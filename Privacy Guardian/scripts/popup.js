chrome.runtime.sendMessage("getBlockedURLs", (response) => {
    const score = 100 - (response.blockedCount * 2); // Simplified score calculation
    document.getElementById('privacyScore').innerText = Math.max(score, 0);

    const list = document.getElementById('blockedTrackersList');
    response.blockedURLs.forEach(url => {
        const listItem = document.createElement('li');
        listItem.textContent = url;
        list.appendChild(listItem);
    });
});