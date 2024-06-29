document.addEventListener("DOMContentLoaded", function () {
    const startGameButton = document.getElementById("start-game");
    startGameButton.addEventListener("click", function () {
      chrome.tabs.create({ url: "game.html" });
    });
  });