// Selecting necessary DOM elements
const captchaTextBox = document.querySelector(".captch_box input");
const refreshButton = document.querySelector(".refresh_button");
const captchaInputBox = document.querySelector(".captch_input input");
const message = document.querySelector(".message");
const submitButton = document.querySelector(".button button");
const difficultySelect = document.querySelector("#difficulty");

// Variable to store generated captcha
let captchaText = null;

// Function to generate captcha
const generateCaptcha = () => {
  let captchaLength;

  switch (difficultySelect.value) {
    case "medium":
      captchaLength = 7;
      break;
    case "hard":
      captchaLength = 10;
      break;
    case "easy":
    default:
      captchaLength = 5;
      break;
  }

  const randomString = Math.random().toString(36).substring(2, 2 + captchaLength);
  const randomStringArray = randomString.split("");
  const changeString = randomStringArray.map((char) => (Math.random() > 0.5 ? char.toUpperCase() : char));
  captchaText = changeString.join("   ");
  captchaTextBox.value = captchaText;
  console.log(captchaText);
};

const refreshBtnClick = () => {
  generateCaptcha();
  captchaInputBox.value = "";
  captchaKeyUpValidate();
};

const captchaKeyUpValidate = () => {
  const isInputEmpty = !captchaInputBox.value.trim();
  submitButton.parentElement.classList.toggle("disabled", isInputEmpty);

  if (isInputEmpty) {
    message.classList.remove("active");
  }
};

// Validation
const submitBtnClick = () => {
  captchaText = captchaText
    .split("")
    .filter((char) => char !== " ")
    .join("");
  message.classList.add("active");
  // Check if the entered captcha text is correct or not
  if (captchaInputBox.value === captchaText) {
    swal("Verification Success..", "Hooray!", "success");
    message.innerText = "Entered captcha is correct";
    message.style.color = "#1940a5";
  } else {
    swal("Incorrect!", "Please enter the correct captcha.", "warning");
    message.innerText = "Entered captcha is not correct";
    message.style.color = "#FF2525";
  }
};

// Add event listeners for the refresh button, captchaInputBox, submit button
refreshButton.addEventListener("click", refreshBtnClick);
captchaInputBox.addEventListener("keyup", captchaKeyUpValidate);
submitButton.addEventListener("click", submitBtnClick);
difficultySelect.addEventListener("change", generateCaptcha);

// Generate a captcha when the page loads
generateCaptcha();
