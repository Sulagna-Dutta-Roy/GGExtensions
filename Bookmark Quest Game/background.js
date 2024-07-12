let gameState = {
  currentLocation: null,
  inventory: [],
  health: 100,
  worldMap: []
};

function initGame() {
  chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
    gameState.worldMap = generateWorldMap(bookmarkTreeNodes[0]);
    if (gameState.worldMap.length > 0) {
      gameState.currentLocation = gameState.worldMap[0];
    }
    chrome.storage.local.set({gameState: gameState});
  });
}

function generateWorldMap(bookmarkNode) {
  let locations = [];
  
  function traverse(node) {
    if (node.url) {
      locations.push({
        title: node.title || "Unknown Location",
        url: node.url,
        description: generateDescription(node.title || "Unknown"),
        challenge: generateChallenge()
      });
    }
    if (node.children) {
      for (let child of node.children) {
        traverse(child);
      }
    }
  }
  
  traverse(bookmarkNode);
  return locations;
}

function generateDescription(title) {
  const adjectives = ['mysterious', 'ancient', 'glowing', 'dark', 'misty'];
  const nouns = ['cavern', 'forest', 'castle', 'village', 'mountain'];
  return `A ${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]} called ${title}`;
}

function generateChallenge() {
  const challenges = ['A fierce dragon guards the entrance', 'A riddle must be solved to proceed', 'A magical barrier blocks the path', 'A group of bandits demands a toll'];
  return challenges[Math.floor(Math.random() * challenges.length)];
}

chrome.runtime.onInstalled.addListener(initGame);
chrome.bookmarks.onCreated.addListener(initGame);
chrome.bookmarks.onRemoved.addListener(initGame);