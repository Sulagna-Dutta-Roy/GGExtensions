const injectPrivacyScore = (score) => {
    const scoreDiv = document.createElement('div');
    scoreDiv.id = 'privacyScoreDiv';
    scoreDiv.style.position = 'fixed';
    scoreDiv.style.bottom = '10px';
    scoreDiv.style.right = '10px';
    scoreDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    scoreDiv.style.color = 'white';
    scoreDiv.style.padding = '10px';
    scoreDiv.style.borderRadius = '5px';
    scoreDiv.style.zIndex = '10000';
    scoreDiv.innerText = `Privacy Score: ${score}`;

    document.body.appendChild(scoreDiv);
};

chrome.runtime.sendMessage("getPrivacyScore", (response) => {
    const score = response.score;
    injectPrivacyScore(score);
});
