// Function to handle quiz submission and scoring
function submitQuiz() {
    const quizForm = document.getElementById('quiz-form'); // Get the quiz form element
    const resultDiv = document.getElementById('result'); // Get the result display element
    const correctAnswers = ['c', 'b', 'a', 'd', 'c', 'b', 'a', 'd', 'a', 'd']; // Array of correct answers
    let score = 0; // Initialize score
    
    // Loop through each question
    for (let i = 0; i < correctAnswers.length; i++) {
        const question = `q${i + 1}`; // Construct the name of each question input
        const selectedAnswer = quizForm[question].value; // Get the selected answer
        
        // Check if the selected answer matches the correct answer
        if (selectedAnswer === correctAnswers[i]) {
            score++; // Increment score if answer is correct
        }
    }
    
    // Display the final score
    resultDiv.textContent = `You scored ${score} out of ${correctAnswers.length}!`;
}
