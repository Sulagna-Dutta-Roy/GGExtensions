(function() {
    let gameButton;
    let scoreDisplay;

    function createGameButton() {
        gameButton = document.createElement('button');
        gameButton.textContent = 'Play Mouse_Maze';
        gameButton.style.position = 'fixed';
        gameButton.style.bottom = '20px';
        gameButton.style.right = '20px';
        gameButton.style.zIndex = '9999';
        gameButton.style.padding = '10px 20px';
        gameButton.style.fontSize = '16px';
        gameButton.style.backgroundColor = '#4CAF50';
        gameButton.style.color = 'white';
        gameButton.style.border = 'none';
        gameButton.style.borderRadius = '5px';
        gameButton.style.cursor = 'pointer';
        
        gameButton.addEventListener('click', openGame);
        
        document.body.appendChild(gameButton);
    }

    function createScoreDisplay() {
        scoreDisplay = document.createElement('div');
        scoreDisplay.style.position = 'fixed';
        scoreDisplay.style.top = '20px';
        scoreDisplay.style.right = '20px';
        scoreDisplay.style.zIndex = '9999';
        scoreDisplay.style.padding = '10px';
        scoreDisplay.style.fontSize = '14px';
        scoreDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        scoreDisplay.style.color = 'white';
        scoreDisplay.style.borderRadius = '5px';
        scoreDisplay.style.display = 'none';
        
        document.body.appendChild(scoreDisplay);
    }

    function openGame() {
        chrome.runtime.sendMessage({action: 'openGame'});
    }

    function updateScore(score) {
        scoreDisplay.textContent = `Best Time: ${score}s`;
        scoreDisplay.style.display = 'block';
    }

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'updateScore') {
            updateScore(request.score);
        }
    });

    // Initialize the content script
    createGameButton();
    createScoreDisplay();

    console.log('Mouse_Maze content script loaded');
})();