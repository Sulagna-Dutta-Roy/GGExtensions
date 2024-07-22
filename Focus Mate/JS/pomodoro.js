// Define variables for timer state
let progressInterval;
let timerValue;
let pomodoroType;
let multiplierFactor;
let audio = new Audio('../assets/audio/alarm.mp3');

// Define constants for timer values
const pomodoroTimerInSeconds = 1500; // 60 seconds * 25 minutes
const shortBreakTimerInSeconds = 300; // 60 seconds * 5 minutes
const TIMER_TYPE_POMODORO = 'POMODORO';
const TIMER_TYPE_SHORT_BREAK = 'SHORTBREAK';

// Retrieve timer value from local storage when extension is launched
chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get(["timerValue"], (result) => {
        timerValue = result.timerValue || pomodoroTimerInSeconds;
    });
});


document.getElementById("start-btn").addEventListener("click", function(){
    startTimer();
});

/* Start Timer */
const startTimer = () => {
    console.log("start");
    
    progressInterval = setInterval(() => {
        if (localStorage.getItem("timer-value") === 0){
            stopTimer();
        }
            
        timerValue--;
        setInfoCircularProgressBar();
        // Update local storage with the updated timer value
        chrome.storage.local.set({ "timerValue": timerValue });
    }, 1000);
}

/* Stop Timer */
const stopTimer = () => {
    clearInterval(progressInterval);
}

/* Reset Timer */
const resetTimer = () => {
    clearInterval(progressInterval);
    timerValue = (pomodoroType === TIMER_TYPE_POMODORO) ? pomodoroTimerInSeconds : shortBreakTimerInSeconds;
    
    multiplierFactor = 360 / timerValue;
    setInfoCircularProgressBar();
    audio.pause();
    // Update local storage with the reset timer value
    localStorage.setItem("timer-value", timerValue);
}

/* update the circular progress bar */
function setInfoCircularProgressBar() {
    if (timerValue === 0) {
        stopTimer();
        audio.play();
    }
    // Update circular progress bar
    let circularProgressBar = document.querySelector('#circularProgressBar');
    let circularProgressBarNumber = document.querySelector('#circularProgressBar .progress-value');
    circularProgressBarNumber.textContent = `${formatNumberInStringMinutes(timerValue)}`;
    circularProgressBar.style.background = `conic-gradient( ${timerValue * multiplierFactor } 360deg, purple 0deg)`;
}

/* format timer value in minutes:seconds */
function formatNumberInStringMinutes(number) {
    const minutes = Math.trunc(number / 60).toString().padStart(2, '0');
    const seconds = Math.trunc(number % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

/* handle setting pomodoro type */
const setPomodoroType = (type) => {
    pomodoroType = type;
    let buttonTypePomodoro = document.querySelector('#buttonTypePomodoro');
    let buttonTypeShortBreak = document.querySelector('#buttonTypeShortBreak');
    if (type === TIMER_TYPE_POMODORO) {
        buttonTypeShortBreak.classList.remove("active");
        buttonTypePomodoro.classList.add("active");
    } else {
        buttonTypePomodoro.classList.remove("active");
        buttonTypeShortBreak.classList.add("active");
    }
    resetTimer();
};

// Event listeners for button clicks to start, stop, reset timers
document.getElementById("stop-btn").addEventListener("click", stopTimer);
document.getElementById("reset-btn").addEventListener("click", resetTimer);
document.getElementById("buttonTypePomodoro").addEventListener("click", () => setPomodoroType(TIMER_TYPE_POMODORO));
document.getElementById("buttonTypeShortBreak").addEventListener("click", () => setPomodoroType(TIMER_TYPE_SHORT_BREAK));
const home = document.querySelector("#home");
home.addEventListener("click", function (event) {
  event.preventDefault();
  window.location.href = "../HTML/popup.html";
});


/*  Pomodoro */
const pomodoro = document.querySelector("#pomodoro");
pomodoro.addEventListener("click", function (event) {
  try{
    event.preventDefault();
    window.location.href = "../HTML/pomodoro.html";
  }catch(error){
    console.log('error', error);
  }
	
});

const todoListIcon = document.querySelector("#todoList");
todoListIcon.addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "../HTML/todo_list.html";
});


const performance = document.querySelector("#progress");
performance.addEventListener("click", function(event){
    event.preventDefault();
    window.location.href = "../HTML/performance.html";
});









