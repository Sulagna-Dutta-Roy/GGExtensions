const timerDisplay = document.querySelector(".display__time-left");
const endTime = document.querySelector(".display__end-time");
const buttons = document.querySelectorAll("[data-time]");
const resetBtn = document.querySelector(".reset");
const pauseBtn = document.querySelector(".pause");
let timeCount;
let alarmTone;
let buttonsVisible = false;

//initial check; needed when user close and popup again while countdown or Pause is active.
chrome.runtime.sendMessage({ type: "initialCheck" }, function (response) {
  if (response.isPaused) {
    displayTimeLeft(response.remainingTime);
    showButtons();
    endTime.textContent = "Time is still Ticking.";
    pauseBtn.textContent = "RESUME";
  } else if (response.isTimesUp) {
    showButtons();
    timesUpFunc();
  }
});

function displayTimeLeft(secondsLeft) {
  const minutes = Math.floor(secondsLeft / 60);
  secondsLeft = secondsLeft % 60;
  const display = `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
  timerDisplay.textContent = display;
  document.title = display;
}

function displayEndTime(timeStamp) {
  const time = new Date(timeStamp);
  const hour = time.getHours();
  const minute = time.getMinutes();
  endTime.textContent = `Get back by ${hour > 12 ? hour - 12 : hour}:${
    minute < 10 ? "0" : ""
  }${minute}`;
}

let hue1 = 0;
let hue2 = 0;
const changeColor = () => {
  hue1 >= 360 ? (hue1 = 0) : (hue1 = hue1 + 3);
  hue2 >= 360 ? (hue2 = 0) : (hue2 = hue2 + 6);
  //hue color: hsl(hue, saturation, lightness)
  document.documentElement.style.background = `linear-gradient(45deg,hsl(${hue1}, 90%, 61%) 0%,hsl(${hue2}, 60%, 55%) 50%,hsl(216, 27%, 41%) 100%)`;
};

function showButtons() {
  buttonsVisible = true;
  resetBtn.classList.add("displayReset");
  pauseBtn.classList.add("displayReset");
}

function timesUpFunc() {
  pauseBtn.classList.add("disablePauseBtn");
  endTime.textContent = "It's not over. It is Now!";
}

//Sends message to background.js
function sendMessageToBackground(message, type) {
  let obj = {
    message,
    type,
  };
  chrome.runtime.sendMessage(obj);
}

//receives message from background.js
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "displayTimeLeft") {
    displayTimeLeft(msg.message);
    if (!buttonsVisible) {
      showButtons();
      const then = Date.now() + msg.message * 1000;
      displayEndTime(then);
    }
  } else if (msg.type === "disablePauseBtn") {
    timesUpFunc();
  } else if (msg.type === "displayEndTime") displayEndTime(msg.message);
});

//Custom Timer Input.
document.customForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (isNaN(+this.minutes.value)) {
    alert("Invalid Input. Please enter a number.");
    this.reset();
    return;
  }
  const inputMin = +this.minutes.value;
  const inSeconds = inputMin * 60;
  sendMessageToBackground(inSeconds, "timer");
  this.reset();
  pauseBtn.textContent = "PAUSE";
});

//Reset button
resetBtn.addEventListener("click", function () {
  sendMessageToBackground("", "RESET");
  timerDisplay.textContent = `0:00`;
  endTime.textContent = "\xA0";
  //'\u00a0' can also be used. These are hexadecimal
  //and unicode notations(respectively), equivalent to &nbsp; in html.
  resetBtn.classList.remove("displayReset");
  pauseBtn.classList.remove("displayReset", "disablePauseBtn");
  buttonsVisible = false;
  pauseBtn.textContent = "PAUSE";
});

//Pause or Resume Button
pauseBtn.addEventListener("click", function () {
  let [remainingMin, remainingSec] = timerDisplay.textContent.split(":");
  remainingMin = +remainingMin;
  remainingSec = +remainingSec;
  const remainingTime =
    remainingMin > 0 ? remainingMin * 60 + remainingSec : remainingSec;
  if (pauseBtn.textContent === "PAUSE") {
    sendMessageToBackground(remainingTime, "PAUSE");
    endTime.textContent = "Time is still Ticking.";
    pauseBtn.textContent = "RESUME";
  } else if (pauseBtn.textContent === "RESUME") {
    pauseBtn.textContent = "PAUSE";
    sendMessageToBackground("", "RESUME");
  }
});

//Quick-Start Buttons
buttons.forEach((button) =>
  button.addEventListener("click", function () {
    sendMessageToBackground(this.dataset.time, "timer");
    pauseBtn.textContent = "PAUSE"; //required when user start a new timer after clicking on PAUSE.
  })
);

//event listener for change in DOM content. something.addEventListner(...) can not detech this change.
let observer = new MutationObserver(changeColor);
const config = {
  characterData: false,
  attributes: false,
  childList: true,
  subtree: false,
};
observer.observe(timerDisplay, config);

// timerDisplay.addEventListener("change", () => {
//   alert("change");   //does not work.
// });
