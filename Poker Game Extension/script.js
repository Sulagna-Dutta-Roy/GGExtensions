document.getElementById('deal-button').addEventListener('click', dealCards);

function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push(rank + suit);
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function dealCards() {
    const deck = shuffleDeck(createDeck());
    const player1Hand = deck.slice(0, 2);
    const player2Hand = deck.slice(2, 4);
    const communityCards = deck.slice(4, 9);

    renderCards('player1-hand', player1Hand);
    renderCards('player2-hand', player2Hand);

    document.getElementById('community-cards').innerHTML = '';
    setTimeout(() => renderCards('community-cards', communityCards.slice(0, 3)), 1000);
    setTimeout(() => renderCards('community-cards', communityCards.slice(0, 4)), 2000);
    setTimeout(() => renderCards('community-cards', communityCards.slice(0, 5)), 3000);
}

function renderCards(elementId, cards) {
    const handElement = document.getElementById(elementId);
    handElement.innerHTML = '';
    for (let card of cards) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerText = card;
        handElement.appendChild(cardElement);
    }
}