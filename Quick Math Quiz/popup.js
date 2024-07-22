document.addEventListener('DOMContentLoaded', function() {
    const questionElement = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const submitButton = document.getElementById('submit');
    const feedbackElement = document.getElementById('feedback');
    const scoreElement = document.getElementById('score');
    
    let score = 0;
    let currentQuestion = {};
  
    function generateQuestion() {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      currentQuestion = {
        question: `${num1} + ${num2}`,
        answer: num1 + num2
      };
      questionElement.textContent = currentQuestion.question;
      answerInput.value = '';
      feedbackElement.textContent = '';
    }
  
    submitButton.addEventListener('click', function() {
      const userAnswer = parseInt(answerInput.value, 10);
      if (userAnswer === currentQuestion.answer) {
        feedbackElement.textContent = 'Correct!';
        score++;
      } else {
        feedbackElement.textContent = 'Wrong. Try again!';
      }
      scoreElement.textContent = score;
      generateQuestion();
    });
  
    generateQuestion();
  });
  