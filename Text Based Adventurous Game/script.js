const stories = [
    {
        start: "You find yourself in a dark forest. There are paths to the left and right.",
        choices: [
            {
                text: "Go left",
                next: {
                    text: "You encounter a wolf. Do you fight or flee?",
                    choices: [
                        { text: "Fight", result: "You bravely fight the wolf and win." },
                        { text: "Flee", result: "You flee safely back to the start." }
                    ]
                }
            },
            {
                text: "Go right",
                next: {
                    text: "You find a treasure chest. Do you open it?",
                    choices: [
                        { text: "Open it", result: "The chest contains gold and jewels!" },
                        { text: "Leave it", result: "You leave the chest and return to the start." }
                    ]
                }
            }
        ]
    },
    {
        start: "You are in a castle. There are doors to the north and south.",
        choices: [
            {
                text: "Go north",
                next: {
                    text: "You meet a dragon. Do you talk to it or attack?",
                    choices: [
                        { text: "Talk", result: "The dragon shares its wisdom with you." },
                        { text: "Attack", result: "The dragon defeats you easily." }
                    ]
                }
            },
            {
                text: "Go south",
                next: {
                    text: "You find a secret passage. Do you enter it?",
                    choices: [
                        { text: "Enter", result: "You discover a hidden library." },
                        { text: "Ignore", result: "You continue exploring the castle." }
                    ]
                }
            }
        ]
    },
    {
        start: "You are on a spaceship. There are buttons to the red and blue rooms.",
        choices: [
            {
                text: "Red room",
                next: {
                    text: "You find an alien. Do you communicate or hide?",
                    choices: [
                        { text: "Communicate", result: "The alien becomes your friend." },
                        { text: "Hide", result: "You hide until the alien leaves." }
                    ]
                }
            },
            {
                text: "Blue room",
                next: {
                    text: "You find a strange device. Do you activate it?",
                    choices: [
                        { text: "Activate", result: "The device teleports you to another planet." },
                        { text: "Leave it", result: "You decide not to risk it." }
                    ]
                }
            }
        ]
    },
    {
        start: "You are in an ancient temple. There are staircases up and down.",
        choices: [
            {
                text: "Go up",
                next: {
                    text: "You find a mystical artifact. Do you take it?",
                    choices: [
                        { text: "Take it", result: "You gain magical powers." },
                        { text: "Leave it", result: "You respect the temple's sanctity." }
                    ]
                }
            },
            {
                text: "Go down",
                next: {
                    text: "You encounter a guardian. Do you challenge or retreat?",
                    choices: [
                        { text: "Challenge", result: "The guardian grants you safe passage." },
                        { text: "Retreat", result: "You safely return to the start." }
                    ]
                }
            }
        ]
    },
    {
        start: "You are in a desert. There is an oasis to the east and a cave to the west.",
        choices: [
            {
                text: "Go east",
                next: {
                    text: "You find a magical lamp. Do you rub it?",
                    choices: [
                        { text: "Rub it", result: "A genie grants you three wishes." },
                        { text: "Ignore it", result: "You leave the lamp untouched." }
                    ]
                }
            },
            {
                text: "Go west",
                next: {
                    text: "You find an ancient artifact. Do you examine it?",
                    choices: [
                        { text: "Examine", result: "You uncover its secrets." },
                        { text: "Leave it", result: "You decide to leave it undisturbed." }
                    ]
                }
            }
        ]
    }
];

let currentStory = null;
let gameTextElement = document.getElementById("game-text");
let gameChoicesElement = document.getElementById("game-choices");

function startGame() {
    currentStory = stories[Math.floor(Math.random() * stories.length)];
    showTextNode(currentStory.start, currentStory.choices);
}

function showTextNode(text, choices) {
    gameTextElement.innerText = text;
    gameChoicesElement.innerHTML = "";
    choices.forEach(choice => {
        const button = document.createElement("button");
        button.innerText = choice.text;
        button.classList.add("choice-button");
        button.onclick = () => selectChoice(choice);
        gameChoicesElement.appendChild(button);
    });
}

function selectChoice(choice) {
    if (choice.result) {
        gameTextElement.innerText = choice.result;
        gameChoicesElement.innerHTML = "";
        const restartButton = document.createElement("button");
        restartButton.innerText = "Restart";
        restartButton.classList.add("choice-button");
        restartButton.onclick = startGame;
        gameChoicesElement.appendChild(restartButton);
    } else {
        showTextNode(choice.next.text, choice.next.choices);
    }
}

startGame();
