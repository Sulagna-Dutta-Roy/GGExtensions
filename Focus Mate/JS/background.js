
// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((message) => {
    switch (message.command) {
        case "start":
            startTimer();
            break;
        case "stop":
            stopTimer();
            break;
        case "reset":
            resetTimer();
            break;
        case "pomodoro":
            setPomodoroType(TIMER_TYPE_POMODORO);
            break;
        case "shortbreak":
            setPomodoroType(TIMER_TYPE_SHORT_BREAK);
            break;
        default:
            break;
    }
});

/* Start Timer */
/* Start Timer */
const startTimer = () => {
    console.log("start");
    progressInterval = setInterval(() => {
        if (timerValue === 0)
            stopTimer();
        timerValue--;
        setInfoCircularProgressBar();
        // Update local storage with the updated timer value
        chrome.storage.local.set({ "timerValue": timerValue });
    }, 1000);
}

/* Stop Timer */
const stopTimer = () => clearInterval(progressInterval);

/* Reset Timer */
const resetTimer = () => {
    clearInterval(progressInterval);
    timerValue = (pomodoroType === TIMER_TYPE_POMODORO) ? pomodoroTimerInSeconds : shortBreakTimerInSeconds;
    multiplierFactor = 360 / timerValue;
    setInfoCircularProgressBar();
    audio.pause();
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
document.getElementById("start-btn").addEventListener("click", startTimer);
document.getElementById("stop-btn").addEventListener("click", stopTimer);
document.getElementById("reset-btn").addEventListener("click", resetTimer);
document.getElementById("buttonTypePomodoro").addEventListener("click", () => setPomodoroType(TIMER_TYPE_POMODORO));
document.getElementById("buttonTypeShortBreak").addEventListener("click", () => setPomodoroType(TIMER_TYPE_SHORT_BREAK));







