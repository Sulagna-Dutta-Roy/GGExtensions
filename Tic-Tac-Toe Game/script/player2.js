let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameButton = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let container = document.querySelector(".container");
let count = 0;
let playerTurn = true;
let playerOScore = 0;
let playerXScore = 0;

const playerOScoreDisplay = document.getElementById("playerO-score");
const playerXScoreDisplay = document.getElementById("playerX-score");

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [3, 4, 5],
    [6, 7, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6]
];

const resetGame = () => {
    playerTurn = true;
    count = 0;
    enableBoxes();
    msgContainer.classList.add("hide");
    container.classList.remove("hide");
}

const updateScore = () => {
    playerOScoreDisplay.innerText = playerOScore;
    playerXScoreDisplay.innerText = playerXScore;
}

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (count === 9 || checkWinner()) {
            return;
        }
        if (playerTurn) {
            box.innerText = "O";
            box.classList.add("O");
            playerTurn = false;
            count++;
        } else {
            box.innerText = "X";
            box.classList.add("X");
            playerTurn = true;
            count++;
        }
        box.disabled = true;
        checkWinner();
        if (count === 9) {
            drawGame();
        }
    });
});

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
}

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
        box.classList.remove("O", "X");
    }
}

const showWinner = (winner) => {
    if (winner === "O") {
        playerOScore++;
    } else if (winner === "X") {
        playerXScore++;
    }
    updateScore();
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    container.classList.add("hide");
    disableBoxes();
}

const drawGame = () => {
    if (!checkWinner()) {
        msg.innerText = "This Game is a Draw.";
        msgContainer.classList.remove("hide");
        container.classList.add("hide");
        disableBoxes();
    }
}

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;
        if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                showWinner(pos1Val);
                return true;
            }
        }
    }
    return false;
};

newGameButton.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
