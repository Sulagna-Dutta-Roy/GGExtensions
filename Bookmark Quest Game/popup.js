function updateGameDisplay() {
    chrome.storage.local.get('gameState', function(data) {
      const gameState = data.gameState;
      if (!gameState || !gameState.currentLocation) {
        document.getElementById('game-content').innerHTML = '<p>Loading game state... If this persists, try refreshing the extension.</p>';
        return;
      }
  
      const content = document.getElementById('game-content');
      
      content.innerHTML = `
        <p><strong>Location:</strong> ${gameState.currentLocation.title}</p>
        <p>${gameState.currentLocation.description}</p>
        <p><strong>Challenge:</strong> ${gameState.currentLocation.challenge}</p>
        <p><strong>Health:</strong> ${gameState.health}</p>
        <p><strong>Inventory:</strong> ${gameState.inventory.join(', ') || 'Empty'}</p>
      `;
    });
  }
  
  function explore() {
    chrome.storage.local.get('gameState', function(data) {
      let gameState = data.gameState;
      const newLocation = gameState.worldMap[Math.floor(Math.random() * gameState.worldMap.length)];
      gameState.currentLocation = newLocation;
      chrome.storage.local.set({gameState: gameState}, updateGameDisplay);
    });
  }
  
  function fight() {
    chrome.storage.local.get('gameState', function(data) {
      let gameState = data.gameState;
      if (Math.random() > 0.5) {
        gameState.inventory.push('Treasure');
        alert('You won the fight and found treasure!');
      } else {
        gameState.health -= 10;
        alert('You lost the fight and took damage!');
      }
      chrome.storage.local.set({gameState: gameState}, updateGameDisplay);
    });
  }
  
  function flee() {
    explore();
    alert('You fled to a new location!');
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    updateGameDisplay();
    
    document.getElementById('explore-btn').addEventListener('click', explore);
    document.getElementById('fight-btn').addEventListener('click', fight);
    document.getElementById('flee-btn').addEventListener('click', flee);
  });