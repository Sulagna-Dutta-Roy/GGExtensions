document.addEventListener('DOMContentLoaded', () => {
    let dealerSum = 0;
    let yourSum = 0;

    let dealerAceCount = 0;
    let yourAceCount = 0; // Aces count as 11 or 1

    let hidden;
    let deck;

    let canHit = true; // allows the player (you) to draw while yourSum <= 21

    window.onload = function() {
        buildDeck();
        shuffleDeck();
        startGame();
    }

    function buildDeck() {
        let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        let types = ["C", "D", "H", "S"];
        deck = [];

        for (let i = 0; i < types.length; i++) {
            for (let j = 0; j < values.length; j++) {
                deck.push(values[j] + "-" + types[i]); // A-C -> K-C, A-D -> K-D
            }
        }
    }

    function shuffleDeck() {
        for (let i = 0; i < deck.length; i++) {
            let j = Math.floor(Math.random() * deck.length);
            let temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
        }
    }

    function startGame() {
        hidden = deck.pop();
        dealerSum += getValue(hidden);
        dealerAceCount += checkAce(hidden);

        while (dealerSum < 17) {
            let cardImg = document.createElement("img");
            let card = deck.pop();
            cardImg.src = "./cards/" + card + ".png";
            cardImg.classList.add("card");
            dealerSum += getValue(card);
            dealerAceCount += checkAce(card);
            document.getElementById("dealer-cards").append(cardImg);
        }

        for (let i = 0; i < 2; i++) {
            let cardImg = document.createElement("img");
            let card = deck.pop();
            cardImg.src = "./cards/" + card + ".png";
            cardImg.classList.add("card");
            yourSum += getValue(card);
            yourAceCount += checkAce(card);
            document.getElementById("your-cards").append(cardImg);
        }

        document.getElementById("hit").addEventListener("click", hit);
        document.getElementById("stay").addEventListener("click", stay);
        document.getElementById("play-again").addEventListener("click", playAgain);
    }

    function hit() {
        if (!canHit) {
            return;
        }

        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        cardImg.classList.add("card");
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);

        if (reduceAce(yourSum, yourAceCount) > 21) {
            canHit = false;
            document.getElementById("results").innerText = "You Lose!";
            document.getElementById("play-again").style.display = "inline";
        }

        document.getElementById("your-sum").innerText = reduceAce(yourSum, yourAceCount);
    }

    function stay() {
        dealerSum = reduceAce(dealerSum, dealerAceCount);
        yourSum = reduceAce(yourSum, yourAceCount);

        canHit = false;
        document.getElementById("dealer-sum").innerText = dealerSum;
        document.getElementById("your-sum").innerText = yourSum;

        let message = "";
        if (yourSum > 21) {
            message = "You Lose!";
        }
        else if (dealerSum > 21) {
            message = "You Win!";
        }
        else if (yourSum == dealerSum) {
            message = "Tie!";
        }
        else if (yourSum > dealerSum) {
            message = "You Win!";
        }
        else if (yourSum < dealerSum) {
            message = "You Lose!";
        }

        document.getElementById("results").innerText = message;
        document.getElementById("play-again").style.display = "inline";
    }

    function getValue(card) {
        let data = card.split("-");
        let value = data[0];

        if (isNaN(value)) {
            if (value == "A") {
                return 11;
            }
            return 10;
        }
        return parseInt(value);
    }

    function checkAce(card) {
        if (card[0] == "A") {
            return 1;
        }
        return 0;
    }

    function reduceAce(playerSum, playerAceCount) {
        while (playerSum > 21 && playerAceCount > 0) {
            playerSum -= 10;
            playerAceCount -= 1;
        }
        return playerSum;
    }

    function playAgain() {
        // Reset game state
        dealerSum = 0;
        yourSum = 0;
        dealerAceCount = 0;
        yourAceCount = 0;
        canHit = true;
        deck = [];
        
        document.getElementById("dealer-cards").innerHTML = "";
        document.getElementById("your-cards").innerHTML = "";
        document.getElementById("dealer-sum").innerText = "0";
        document.getElementById("your-sum").innerText = "0";
        document.getElementById("results").innerText = "";
        document.getElementById("play-again").style.display = "none";

        buildDeck();
        shuffleDeck();
        startGame();
    }
});
