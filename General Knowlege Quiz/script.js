function submitQuiz() {
    const correctAnswers = {
        q1: "c",
        q2: "b",
        q3: "a",
        q4: "d",
        q5: "b",
        q6: "a",
        q7: "c",
        q8: "c",
        q9: "b",
        q10: "c",
    };
    
    const form = document.getElementById('quiz-form');
    let score = 0;
    const totalQuestions = Object.keys(correctAnswers).length;
    
    for (let i = 1; i <= totalQuestions; i++) {
        const question = `q${i}`;
        const selectedAnswer = form.elements[question].value;
        if (selectedAnswer === correctAnswers[question]) {
            score++;
        }
    }
    
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `You scored ${score} out of ${totalQuestions}.`;
}
