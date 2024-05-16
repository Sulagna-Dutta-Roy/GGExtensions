// Selecting necessary DOM elements
const captchaTextBox = document.querySelector(".captch_box input");
const refreshButton = document.querySelector(".refresh_button");
const captchaInputBox = document.querySelector(".captch_input input");
const message = document.querySelector(".message");
const submitButton = document.querySelector(".button");

// Variable to store generated captcha and captcha history
let captchaText = null;
const captchaHistory = [];

// Function to generate captcha
const generateCaptcha = () => {
  const randomString = Math.random().toString(36).substring(2, 7);
  const randomStringArray = randomString.split("");
  const changeString = randomStringArray.map((char) => (Math.random() > 0.5 ? char.toUpperCase() : char));
  captchaText = changeString.join("   ");
  captchaTextBox.value = captchaText;
  captchaHistory.unshift(captchaText); // Add generated captcha to history
};

// Function to refresh captcha on button click
const refreshBtnClick = () => {
  generateCaptcha();
  captchaInputBox.value = "";
  captchaKeyUpValidate();
};

// Function to validate captcha input on keyup event
const captchaKeyUpValidate = () => {
  submitButton.classList.toggle("disabled", !captchaInputBox.value);
  if (!captchaInputBox.value) message.classList.remove("active");
};

// Function to handle submission of captcha
const submitBtnClick = () => {
  captchaText = captchaText.split("").filter((char) => char !== " ").join("");
  message.classList.add("active");
  // Check if the entered captcha text is correct or not
  if (captchaInputBox.value === captchaText) {
    swal("Verification Success..","Hooray!","success");
    message.innerText = "Entered captcha is correct";
    message.style.color = "#1940a5";
  } else {
    swal("Incorrect!","Please enter the correct captcha.","warning")
    message.innerText = "Entered captcha is not correct";
    message.style.color = "#FF2525";
  }
  updateCaptchaHistory(); // Update captcha history after submission
};

// Function to update captcha history
const updateCaptchaHistory = () => {
  const historyList = document.getElementById("captchaHistoryList");
  historyList.innerHTML = "";
  captchaHistory.forEach((captcha) => {
    const listItem = document.createElement("li");
    listItem.textContent = captcha;
    historyList.appendChild(listItem);
  });
};

// Function to play audio captcha
const playAudioCaptcha = () => {
  const audio = new Audio('audio/captcha.mp3');
  audio.play();
};

// Add event listeners for the refresh button, captchaInputBox, submit button, and audio captcha button
refreshButton.addEventListener("click", refreshBtnClick);
captchaInputBox.addEventListener("keyup", captchaKeyUpValidate);
submitButton.addEventListener("click", submitBtnClick);
document.querySelector(".audio-captcha button").addEventListener("click", playAudioCaptcha);

// Generate a captcha when the page loads
generateCaptcha();
