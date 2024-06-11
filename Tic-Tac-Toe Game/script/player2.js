let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameButton = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msgContainer2 = document.querySelector(".msg-container2");
let msg = document.querySelector("#msg");
let msg2 = document.querySelector("#msg2");
let container = document.querySelector(".container");
let count = 0;
let turnO = true;
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
    turnO = true;
    count=0;
    enableBoxes();
    msgContainer.classList.add("hide");
    container.classList.remove("hide");
}
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (count === 9 || checkWinner()) {
            return;
        }
      if (turnO) {
        //playerO
        box.innerText = "O";
        box.style.color="white";
        turnO = false;
      } else {
        //playerX
        box.innerText = "X";
        box.style.color="cyan";
        turnO = true;
      }
      box.disabled = true;
      count++;
  
      let isWinner = checkWinner();
  
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
    }
}
const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    container.classList.add("hide");
    if(hideDisplay=="inline"){
        hide2.style.display="none";
    }
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
                console.log("winner is ", pos1Val)
                showWinner(pos1Val);
                return true;
            }

        }
    }
    return false;
};

newGameButton.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);