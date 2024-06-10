let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameButton = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msgContainer2 = document.querySelector(".msg-container2");
let msg = document.querySelector("#msg");
let msg2 = document.querySelector("#msg2");
let container = document.querySelector(".container");
let count = 0;
let playerTurn = true;
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
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (count === 9 || checkWinner() || !playerTurn) {
            return;
        }
        if (playerTurn) {
            box.innerText = "O";
            box.style.color = "white";
            box.disabled = true;
            playerTurn = false;
            count++;
            if (!checkWinner() && count < 9) {
                setTimeout(computerTurn, 500); // Delay computer's turn for better user experience
            }
        }
    });
});

const computerTurn = () => {
    let availableBoxes = [];
    boxes.forEach((box, index) => {
        if (box.innerText === "") {
            availableBoxes.push(index);
        }
    });

    if (availableBoxes.length > 0) {
        let randomIndex = availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
        boxes[randomIndex].innerText = "X";
        boxes[randomIndex].style.color = "cyan";
        boxes[randomIndex].disabled = true;
        playerTurn = true;
        count++;
        checkWinner();
        if (count === 9) {
            drawGame();
        }
    }
};

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
}
const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
}
const showWinner = (winner) => {
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
