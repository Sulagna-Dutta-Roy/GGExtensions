document.addEventListener('DOMContentLoaded', function() {
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    let score = 0;
    let flippedCards = [];
    let matchedCards = [];
    const cards = [
      'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 
      'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'
    ];
  
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  
    function createCard(value) {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.value = value;
      card.textContent = '';
      card.addEventListener('click', onCardClick);
      return card;
    }
  
    function onCardClick(event) {
      const clickedCard = event.target;
  
      if (
        flippedCards.length < 2 &&
        !clickedCard.classList.contains('flipped') &&
        !matchedCards.includes(clickedCard)
      ) {
        flipCard(clickedCard);
        flippedCards.push(clickedCard);
  
        if (flippedCards.length === 2) {
          checkForMatch();
        }
      }
    }
  
    function flipCard(card) {
      card.classList.add('flipped');
      card.textContent = card.dataset.value;
    }
  
    function unflipCard(card) {
      card.classList.remove('flipped');
      card.textContent = '';
    }
  
    function checkForMatch() {
      const [card1, card2] = flippedCards;
  
      if (card1.dataset.value === card2.dataset.value) {
        matchedCards.push(card1, card2);
        score++;
        scoreDisplay.textContent = score;
        flippedCards = [];
  
        if (matchedCards.length === cards.length) {
          setTimeout(() => alert('Congratulations! You matched all the cards!'), 300);
        }
      } else {
        setTimeout(() => {
          unflipCard(card1);
          unflipCard(card2);
          flippedCards = [];
        }, 1000);
      }
    }
  
    function startGame() {
      shuffle(cards);
      cards.forEach(value => {
        const card = createCard(value);
        gameBoard.appendChild(card);
      });
    }
  
    startGame();
  });
  