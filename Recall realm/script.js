document.addEventListener('DOMContentLoaded', () => {
    const cardArray = [
      { name: 'A', id: 1 },
      { name: 'A', id: 2 },
      { name: 'B', id: 3 },
      { name: 'B', id: 4 },
      { name: 'C', id: 5 },
      { name: 'C', id: 6 },
      { name: 'D', id: 7 },
      { name: 'D', id: 8 },
      { name: 'E', id: 9 },
      { name: 'E', id: 10 },
      { name: 'F', id: 11 },
      { name: 'F', id: 12 },
      { name: 'G', id: 13 },
      { name: 'G', id: 14 },
      { name: 'H', id: 15 },
      { name: 'H', id: 16 }
    ];
  
    cardArray.sort(() => 0.5 - Math.random());
  
    const gameBoard = document.getElementById('game-board');
    const restartBtn = document.getElementById('restart-btn');
    let cardsChosen = [];
    let cardsChosenId = [];
    let cardsWon = [];
  
    function createBoard() {
      cardArray.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('data-id', index);
  
        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');
  
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.textContent = '?';
  
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = card.name;
  
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardElement.appendChild(cardInner);
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
      });
    }
  
    function flipCard() {
      const cardId = this.getAttribute('data-id');
      cardsChosen.push(cardArray[cardId].name);
      cardsChosenId.push(cardId);
      this.classList.add('flip');
  
      if (cardsChosen.length === 2) {
        setTimeout(checkForMatch, 500);
      }
    }
  
    function checkForMatch() {
      const cards = document.querySelectorAll('.card');
      const [firstCard, secondCard] = cardsChosenId;
      if (cardsChosen[0] === cardsChosen[1] && firstCard !== secondCard) {
        cards[firstCard].removeEventListener('click', flipCard);
        cards[secondCard].removeEventListener('click', flipCard);
        cardsWon.push(cardsChosen);
      } else {
        cards[firstCard].classList.remove('flip');
        cards[secondCard].classList.remove('flip');
      }
      cardsChosen = [];
      cardsChosenId = [];
      if (cardsWon.length === cardArray.length / 2) {
        alert('Congratulations! You found them all!');
      }
    }
  
    restartBtn.addEventListener('click', () => {
      cardsWon = [];
      gameBoard.innerHTML = '';
      createBoard();
    });
  
    createBoard();
  });
  