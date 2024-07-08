document.addEventListener("DOMContentLoaded", () => {
    const reels = document.querySelectorAll(".reel");
    reels.forEach((reel) => {
      reel.textContent = getRandomFruit();
    });
  });
  
  document.getElementById("spin-button").addEventListener("click", spin);
  document.getElementById("reset-button").addEventListener("click", reset);
  document.getElementById("rules-button").addEventListener("click", toggleRules);
  
  const fruits = ["🍒", "🍋", "🍊", "🍇", "🍉", "🍍", "🍓", "🍌", "🍏"];
  let balance = 100;
  
  const spinSound = new Audio("spin.mp3");
  const winSound = new Audio("win.mp3");
  
  function getRandomFruit() {
    return fruits[Math.floor(Math.random() * fruits.length)];
  }
  
  function spin() {
    spinSound.play();
  
    const reels = document.querySelectorAll(".reel");
  
    reels.forEach((reel) => {
      reel.style.transform = "rotateX(360deg)";
    });
  
    setTimeout(() => {
      reels.forEach((reel) => {
        reel.textContent = getRandomFruit();
      });
  
      const symbols = Array.from(reels).map((reel) => reel.textContent);
      checkResult(symbols);
    }, 500);
  }
  
  function checkResult(symbols) {
    const result = document.getElementById("result");
  
    const isWin = symbols[0] === symbols[1] && symbols[1] === symbols[2];
  
    if (isWin) {
      winSound.play();
      balance += 50;
      result.textContent = "🎉 You win $50! 🎉";
      animateWinningSymbols();
    } else {
      balance -= 10;
      result.textContent = "Try again!";
    }
    document.getElementById("balance").textContent = `Balance: $${balance}`;
  }
  
  function animateWinningSymbols() {
    const reels = document.querySelectorAll(".reel");
  
    reels.forEach((reel) => {
      reel.classList.add("win-animation");
      setTimeout(() => {
        reel.classList.remove("win-animation");
      }, 1000);
    });
  }
  
  function toggleRules() {
    const rulesCard = document.getElementById("rules-card");
    rulesCard.classList.toggle("hidden");
  }
  
  function reset() {
    balance = 100;
    document.getElementById("balance").textContent = `Balance: $${balance}`;
  }
  