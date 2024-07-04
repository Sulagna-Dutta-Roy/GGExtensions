const word = document.getElementById("word");
const text = document.getElementById("text");
const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");
const endgameElement = document.getElementById("end-game-container");
const settingsButton = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");
const difficultySelect = document.getElementById("difficulty");
const words = [
  "melancholic",
  "temperate",
  "glacial",
  "tenebrous",
  "luminous",
  "cacophonous",
  "inaudible",
  "nimble",
  "languid",
  "magnanimous",
  "vindictive",
  "antediluvian",
  "nascent",
  "proximate",
  "remote",
  "lofty",
  "abyssal",
  "drenched",
  "parched",
  "supple",
  "phlegmatic",
  "recalcitrant",
  "obfuscate",
  "quixotic",
  "sesquipedalian",
  "perspicacious",
  "lachrymose",
  "pulchritudinous",
  "equanimous",
  "juxtaposition",
  "verisimilitude",
  "concatenation",
  "mellifluous",
  "obstreperous",
  "perfidious",
  "sycophant",
  "truculent",
  "ubiquitous",
  "vociferous",
  "xenophobia",
  "yen",
  "zephyr",
  "sigh",
  "tense",
  "airplane",
  "ball",
  "pies",
  "juice",
  "warlike",
  "bad",
  "north",
  "dependent",
  "steer",
  "silver",
  "highfalutin",
  "superficial",
  "quince",
  "eight",
  "feeble",
  "admit",
  "drag",
  "happy",
  "bright",
  "quick",
  "small",
  "big",
  "jump",
  "laugh",
  "sing",
  "run",
  "play",
  "sad",
  "warm",
  "cold",
  "dark",
  "light",
  "loud",
  "quiet",
  "fast",
  "slow",
  "kind",
  "mean",
  "old",
  "young",
  "near",
  "far",
  "high",
  "low",
  "wet",
  "dry",
  "soft",
  "hard",
  "smooth",
  "rough",
  "bitter",
  "sweet",
  "salty",
  "spicy",
  "calm",
  "angry",
  "curious",
  "bored",
  "excited",
  "scared",
  "brave",
  "shy",
  "tired",
  "energetic",
  "funny",
  "serious",
  "smart",
  "silly",
  "zealous",
  "variegated",
  "ephemeral",
  "snug",
  "colossal",
];

let randomWord;
let score = 0;
let time = 10;
// let difficulty = "medium";
let difficulty =
  localStorage.getItem("difficulty") !== null
    ? localStorage.getItem("difficulty")
    : "medium";

const timeInterval = setInterval(updateTime, 1000);

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function addWordToDom() {
  randomWord = getRandomWord();
  word.innerText = randomWord;
}

function updateScore() {
  score++;
  scoreElement.innerText = score;
}

function updateTime() {
  time--;
  timeElement.innerText = time + "s";
  if (time === 0) {
    clearInterval(timeInterval);
    gameOver();
  }
}

function gameOver() {
  endgameElement.innerHTML = `
    <h1>Time ran out</h1>
    <p>Your final score is ${score}</p>
    <button onclick="history.go(0)">Play Again</button>
    `;
  endgameElement.style.display = "flex";
}

text.addEventListener("input", (e) => {
  const insertedText = e.target.value;
  if (insertedText === randomWord) {
    e.target.value = "";
    addWordToDom();
    updateScore();
    if (difficulty === "hard") time += 2;
    else if (difficulty === "medium") time += 3;
    else time += 5;
    updateTime();
  }
});

settingsButton.addEventListener("click", () =>
  settings.classList.toggle("hide")
);
settingsForm.addEventListener("change", (e) => {
  difficulty = e.target.value;
  localStorage.setItem("difficulty", difficulty);
});

difficultySelect.value = difficulty;
addWordToDom();
text.focus();
