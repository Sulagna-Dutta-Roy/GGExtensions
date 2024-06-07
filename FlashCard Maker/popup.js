document.addEventListener('DOMContentLoaded', function () {
    let flashcards = [];
    const questionInput = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const addFlashcardButton = document.getElementById('add-flashcard');
    const decksContainer = document.getElementById('decks');
    const startStudyButton = document.getElementById('start-study');
  
    addFlashcardButton.addEventListener('click', addFlashcard);
    startStudyButton.addEventListener('click', startStudy);
  
    function addFlashcard() {
      const question = questionInput.value.trim();
      const answer = answerInput.value.trim();
  
      if (question && answer) {
        flashcards.push({ question, answer });
        renderDecks();
        questionInput.value = '';
        answerInput.value = '';
        saveFlashcards();
      }
    }
  
    function renderDecks() {
      decksContainer.innerHTML = '';
      flashcards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'flashcard';
        cardElement.innerHTML = `<strong>Q:</strong> ${card.question} <br> <strong>A:</strong> ${card.answer}`;
        decksContainer.appendChild(cardElement);
      });
    }
  
    function startStudy() {
      if (flashcards.length === 0) {
        alert('No flashcards to study.');
        return;
      }
  
      let currentIndex = 0;
      function showCard() {
        const card = flashcards[currentIndex];
        const question = prompt(`Question: ${card.question}`);
        if (question === null) return; // exit if user cancels
        alert(`Answer: ${card.answer}`);
        currentIndex = (currentIndex + 1) % flashcards.length;
        setTimeout(showCard, 1000); // show next card after 1 second
      }
  
      showCard();
    }
  
    function saveFlashcards() {
      chrome.storage.sync.set({ flashcards }, function () {
        console.log('Flashcards saved.');
      });
    }
  
    function loadFlashcards() {
      chrome.storage.sync.get('flashcards', function (data) {
        if (data.flashcards) {
          flashcards = data.flashcards;
          renderDecks();
        }
      });
    }
  
    loadFlashcards();
  });
  