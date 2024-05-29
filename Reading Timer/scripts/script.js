let timerInterval;
let elapsedSeconds = 0;

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const logBtn = document.getElementById('logBtn');
const timeDisplay = document.getElementById('time');
const bookInput = document.getElementById('bookInput');
const logList = document.getElementById('logList');

function startTimer() {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        elapsedSeconds++;
        timeDisplay.textContent = formatTime(elapsedSeconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    stopTimer();
    elapsedSeconds = 0;
    timeDisplay.textContent = formatTime(elapsedSeconds);
}

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return '${hrs}:${mins}:${secs}';
}

function logReading() {
    const bookTitle = bookInput.value.trim();
    if (bookTitle) {
        const listItem = document.createElement('li');
        listItem.textContent = '${bookTitle} - ${timeDisplay.textContent}';
        logList.appendChild(listItem);
        bookInput.value = '';
    }
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
logBtn.addEventListener('click', logReading);