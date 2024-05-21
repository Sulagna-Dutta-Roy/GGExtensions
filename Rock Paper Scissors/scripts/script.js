const gameContainer = document.querySelector(".container"),
  userResult = document.querySelector(".user_result img"),
  cpuResult = document.querySelector(".cpu_result img"),
  result = document.querySelector(".result"),
  userScoreDisplay = document.querySelector(".user_score"),
  cpuScoreDisplay = document.querySelector(".cpu_score"),
  resetButton = document.querySelector(".reset"),
  winnerModal = document.getElementById("winnerModal"),
  winnerMessage = document.getElementById("winnerMessage"),
  playAgainButton = document.getElementById("playAgainButton");

let userScore = 0,
  cpuScore = 0;

const optionImages = document.querySelectorAll(".option_image");

function checkWinner() {
  if (userScore === 5) {
    showWinner("User");
  } else if (cpuScore === 5) {
    showWinner("CPU");
  }
}

function showWinner(winner) {
  winnerMessage.textContent = `${winner} Won 5 Times!`;
  winnerModal.style.display = "block";
}

function resetGame() {
  userScore = 0;
  cpuScore = 0;
  userScoreDisplay.textContent = `User: ${userScore}`;
  cpuScoreDisplay.textContent = `CPU: ${cpuScore}`;
  result.textContent = "Let's Play!!";
  optionImages.forEach(image => image.classList.remove("active"));
}

playAgainButton.addEventListener("click", () => {
  winnerModal.style.display = "none";
  resetGame();
});

optionImages.forEach((image, index) => {
  image.addEventListener("click", (e) => {
    image.classList.add("active");

    userResult.src = cpuResult.src = "images/rock.png";
    result.textContent = "Wait...";

    optionImages.forEach((image2, index2) => {
      index !== index2 && image2.classList.remove("active");
    });

    gameContainer.classList.add("start");

    let time = setTimeout(() => {
      gameContainer.classList.remove("start");

      let imageSrc = e.target.querySelector("img").src;
      userResult.src = imageSrc;

      let randomNumber = Math.floor(Math.random() * 3);
      let cpuImages = ["images/rock.png", "images/paper.png", "images/scissors.png"];
      cpuResult.src = cpuImages[randomNumber];

      let cpuValue = ["R", "P", "S"][randomNumber];
      let userValue = ["R", "P", "S"][index];

      let outcomes = {
        RR: "Draw",
        RP: "Cpu",
        RS: "User",
        PP: "Draw",
        PR: "User",
        PS: "Cpu",
        SS: "Draw",
        SR: "Cpu",
        SP: "User",
      };

      let outComeValue = outcomes[userValue + cpuValue];

      result.textContent = userValue === cpuValue ? "Match Draw" : `${outComeValue} Won!!`;

      if (outComeValue === "User") {
        userScore++;
      } else if (outComeValue === "Cpu") {
        cpuScore++;
      }

      userScoreDisplay.textContent = `User: ${userScore}`;
      cpuScoreDisplay.textContent = `CPU: ${cpuScore}`;

      checkWinner();
    }, 2500);
  });
});

resetButton.addEventListener("click", () => {
  resetGame();
});
