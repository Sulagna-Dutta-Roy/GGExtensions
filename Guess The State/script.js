

const moviesObject = {
    "This state is famous for its backwaters and spice plantations. It's known as 'God's Own Country'.": "Kerala",
    "This state is the largest in terms of area and is known for its Thar Desert and vibrant culture": "Rajasthan",
    "This state is home to Bollywood, the Gateway of India, and the financial capital of the country.": "Maharashtra",
    "This northeastern state is known for its tea gardens and Kaziranga National Park, which is home to the one-horned rhinoceros.": "Assam",
    "This southern state is famous for its classical dance form Bharatanatyam and the city of Chennai.": "Tamil Nadu",
    "This state is known for its beaches, temples, and the software industry in its capital, Bengaluru.": "Karnataka",
    "This state has the highest literacy rate in India and is famous for its beautiful backwaters and houseboats.": "Kerala",
    "This northern state is home to the Taj Mahal, one of the Seven Wonders of the World.": "Uttar Pradesh ",
    "This state is known for its rich cultural heritage, temples, and the famous Sun Temple in Konark.": "Odisha",
    "This state, often referred to as the 'Land of Five Rivers,' is known for its vibrant Bhangra dance and delicious cuisine.": "Punjab ",
    "This state is known for its beautiful valleys, the Dal Lake, and is often called 'Paradise on Earth.'": "Jammu and Kashmir",
    "This state is famous for the Golden Temple, the holiest shrine in Sikhism.": "Punjab",
    "This eastern state is known for its classical dance Odissi and the Jagannath Temple in Puri.": "Odisha",
    "This state is known for the city of Hyderabad, Charminar, and biryani.": "Telangana",
    "This state is famous for its tea gardens, monasteries, and the city of Gangtok.": "Sikkim",
    "This state is known for the Pink City, Jaipur, and the Ranthambore National Park.": "Rajasthan",
    "This state is known for its literacy and progressive education system.": "Kerala"
};
const container = document.querySelector(".container");
const startButton = document.getElementById("start");
const letterContainer = document.getElementById("letter-container");
const resultContainer = document.querySelector(".result-container");
const userInputSection = document.getElementById("userInputSection");
const resultText = document.getElementById("result");
const hints = Object.keys(moviesObject);
let randomHint = "",
randomWord = "";
let winCount = 0,
lossCount = 5;

const generateRandomValue = (array) => Math.floor(Math.random() * array.length);

// Blocker
const blocker = () => {
    let letterButtons = document.querySelectorAll(".letters");
    letterButtons.forEach((button) => {
        button.disabled = true;
    });
};

// Start game
const startGame = () => {
    init();
};

// Generate Word
const generateWord = () => {
    letterContainer.classList.remove("hide");
    userInputSection.innerText = "";
    randomHint = hints[generateRandomValue(hints)];
    randomWord = moviesObject[randomHint];
    container.innerHTML = `<div id="movieHint">${randomHint}</div>`;
    let displayItem = "";
    randomWord.split("").forEach((value) => {
        if (value == " ") {
            winCount += 1;
            displayItem += `<span class="inputSpace">&nbsp;</span>`;
        } else {
            displayItem += `<span class="inputSpace">_</span>`;
        }
    });
    userInputSection.innerHTML = displayItem;
};

// Initial Function
const init = () => {
    winCount = 0;
    lossCount = 5;
    document.getElementById(
        "chanceCount"
    ).innerHTML = `<span>Tries Left: </span>${lossCount}`;
    randomHint = null;
    randomWord = "";
    userInputSection.innerHTML = "";
    letterContainer.classList.add("hide");
    letterContainer.innerHTML = "";
    generateWord();
    for (let i = 65; i < 91; i++) {
        let button = document.createElement("button");
        button.classList.add("letters");
        // Number to ASCII [A - Z]
        button.innerText = String.fromCharCode(i);
        // Character button click
        button.addEventListener("click", () => {
            let charArray = randomWord.toUpperCase().split("");
            let inputSpace = document.getElementsByClassName("inputSpace");
            if (charArray.includes(button.innerText)) {
                charArray.forEach((char, index) => {
                if (char === button.innerText) {
                        button.classList.add("used");
                        inputSpace[index].innerText = char;
                        winCount += 1;
                        if (winCount == charArray.length) {
                            resultText.innerHTML = "You Won";
                            resultContainer.style.display = '';
                            blocker();
                        }
                    }
                });
            } else {
                lossCount -= 1;
                document.getElementById(
                "chanceCount"
                ).innerHTML = `<span>Tries Left: </span> ${lossCount}`;
                button.classList.add("used");
                if (lossCount == 0) {
                    resultText.innerHTML = "Game Over";
                    blocker();
                    resultContainer.style.display = '';
                    letterContainer.classList.add("hide");
                }
            }
            button.disabled = true;
            });
        letterContainer.appendChild(button);
    }
};

window.onload = () => {
    startGame();
};