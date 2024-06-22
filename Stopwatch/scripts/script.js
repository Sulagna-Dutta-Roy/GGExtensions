const playButton = document.getElementsByClassName("play")[0];
const lapButton = document.getElementsByClassName("lap")[0];
const resetButton = document.getElementsByClassName("reset")[0];
const clearButton = document.getElementsByClassName("lap-clear-button")[0];
const minute = document.getElementsByClassName("minute")[0];
const second = document.getElementsByClassName("sec")[0];
const centiSecond = document.getElementsByClassName("msec")[0];
const laps = document.getElementsByClassName("laps")[0];
const bg = document.getElementsByClassName("outer-circle")[0];

let isPlay = false
let secCounter = 0;
let min;
let sec;
let centiSec;
let centiCounter = 0;
let minCounter = 0;
let isReset = false;
let lapItem = 0;

const toggleButton = () => {
    lapButton.classList.remove("display-none");
    resetButton.classList.remove("display-none");
}




// Play



const play = () => {
    if (!isPlay && !isReset) {
        playButton.innerHTML = 'Pause';
        bg.classList.add("animation-bg");
        min = setInterval(() => {
            minute.innerHTML = `${minCounter<9?'0':''}${++minCounter} : `;
        }, 60 * 1000);

        sec = setInterval(() => {
            if (secCounter === 60) {
                secCounter = 0;
            }
             
            second.innerHTML = `&nbsp;${secCounter<9?'0':''}${++secCounter} : `;
        }, 1000);

        centiSec = setInterval(() => {
            if (centiCounter === 100) {
                centiCounter = 0;
            }
            centiSecond.innerHTML = `&nbsp;${centiCounter<9?'0':''}${++centiCounter}`;
        }, 10);

        isPlay = true;
        isReset = true;
    }
    else {
        playButton.innerHTML = 'Play';
        clearInterval(min);
        clearInterval(sec);
        clearInterval(centiSec);
        isPlay = false;
        minCounter=0
        secCounter=0
        centiCounter=0
        isReset = false;
        bg.classList.remove("animation-bg");
    }

    toggleButton();
}



// Reset



const reset = () => {
    isReset = true;
    play();
    lapButton.classList.add("display-none")
    lapButton.classList.add("display-none");
    resetButton.classList.add("display-none");
    minute.innerHTML = '0 :';
    second.innerHTML = '&nbsp;0 :'
    centiSecond.innerHTML = '&nbsp;0';
}




// Lap




const lap = () => {
    const li = document.createElement("li");
    const number = document.createElement("span");
    const timeStamp = document.createElement("span");

    li.setAttribute("class", "lap-item");
    number.setAttribute("class", "number");
    timeStamp.setAttribute("class", "time-stamp");

    number.innerText = `#${++lapItem}`;
    timeStamp.innerHTML = `${minCounter} : ${secCounter} : ${centiCounter}`;

    li.append(number, timeStamp);
    laps.append(li);

    clearButton.classList.remove("display-none");
}



// Clear All

const clearAll = () => {
    laps.innerHTML = '';
    laps.append(clearButton);
    clearButton.classList.add("display-none");
}

playButton.addEventListener("click", play);
resetButton.addEventListener("click", reset);
lapButton.addEventListener("click", lap);
clearButton.addEventListener("click", clearAll);