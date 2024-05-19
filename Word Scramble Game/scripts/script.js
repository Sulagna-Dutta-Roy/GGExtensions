const wordText = document.querySelector(".word"),
    hintText = document.querySelector(".hint span"),
    timeText = document.querySelector(".time b"),
    inputField = document.querySelector("input"),
    refreshBtn = document.querySelector(".refresh-word"),
    checkBtn = document.querySelector(".check-word"),
    contentBox = document.querySelector(".container .content"),
    startArea = document.querySelector(".startArea"),
    scoreArea = document.querySelector(".score"),
    modalContent = document.querySelector(".modal-content");

// Get the modal
var modal = document.getElementById("myModal");
// Get the button that opens the modal
var btn = document.getElementById("myBtn");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// Get the text of modal
var modalText = document.getElementById("modalText");

let correctWord, timer;
let score = 0;

const initTimer = maxTime => {
    clearInterval(timer);
    timer = setInterval(() => {
        if (maxTime > 0) {
            maxTime--;
            return timeText.innerText = maxTime;
        }
        modal.style.display = "block";
        modalContent.classList.add("modal-wrong");
        modalText.innerHTML = `<br>Time off! <b>${correctWord.toUpperCase()}</b> was the correct word`;
        endGame();
    }, 1000);
}

const start = () => {
    contentBox.style.display = "block";
    startArea.style.display = "none";
    resetModal();
    score = 0; // Reset score to 0 when starting a new game
    scoreArea.innerText = score; // Update score display
    initGame();
}

const resetModal = () => {
    modal.style.display = "none";
    modalContent.classList.remove("modal-correct");
    modalContent.classList.remove("modal-wrong");
    modalText.innerHTML = ""; // Clear modal text
}

const endGame = () => {
    clearInterval(timer);
    contentBox.style.display = "none";
    startArea.style.display = "block";
    modal.style.display = "block";
    modalContent.classList.remove("modal-correct");
    modalContent.classList.add("modal-wrong");
    modalText.innerHTML = `
    <center><br>Time off! <b>${correctWord.toUpperCase()}</b> was the correct word.
    <br>You Lost The Game ! :(</center><br>
    `;
}

const winGame = () => {
    clearInterval(timer);
    contentBox.style.display = "none";
    startArea.style.display = "block";
    modal.style.display = "block";
    modalContent.classList.add("modal-correct");
    modalText.innerHTML = `<br><center>Congrats You WIN THE GAME !!!!!!</center>`;
}

const initGame = () => {
    if (score > 9) {
        winGame();
        return; // Exit initGame if the player has won
    }
    initTimer(30);
    let randomObj = words[Math.floor(Math.random() * words.length)];
    let wordArray = randomObj.word.split("");
    for (let i = wordArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    
    wordText.innerText = wordArray.join("");
    hintText.innerText = randomObj.hint;
    correctWord = randomObj.word.toLowerCase();
    inputField.value = "";
    inputField.setAttribute("maxlength", correctWord.length);
    scoreArea.innerHTML = score;
}

const checkWord = () => {
    let userWord = inputField.value.toLowerCase();

    if (!userWord) {
        modal.style.display = "block";
        modalContent.classList.remove("modal-wrong");
        modalContent.classList.remove("modal-correct");
        return modalText.innerHTML = `<br>Please enter the word to check!`;
    }

    if (userWord !== correctWord) {
        if (score >= 1) {
            score = score - 1;
            scoreArea.innerHTML = score;
        }
        modal.style.display = "block";
        modalContent.classList.add("modal-wrong");
        return modalText.innerHTML = `<br>Oops! <b>${userWord}</b> is not a correct word`;
    } else {
        modal.style.display = "block";
        modalContent.classList.remove("modal-wrong");
        modalContent.classList.add("modal-correct");
        modalText.innerHTML = `<br>Congrats! <b>${correctWord.toUpperCase()}</b> is the correct word`;
        score++;
    }

    initGame();
}

refreshBtn.addEventListener("click", initGame);
checkBtn.addEventListener("click", checkWord);

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

