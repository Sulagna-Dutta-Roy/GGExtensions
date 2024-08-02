function submitQuiz() {
    var totalQuestions = 10;
    var correctAnswers = 0;

    var answers = {
        q1: 'a',
        q2: 'b',
        q3: 'b',
        q4: 'a',
        q5: 'b',
        q6: 'a',
        q7: 'a',
        q8: 'b',
        q9: 'b',
        q10: 'b'
    };

    for (var i = 1; i <= totalQuestions; i++) {
        var questionName = 'q' + i;
        var selectedOption = document.querySelector('input[name="' + questionName + '"]:checked');
        
        if (selectedOption && selectedOption.value === answers[questionName]) {
            correctAnswers++;
        }
    }

    var result = document.getElementById('result');
    result.textContent = 'You scored ' + correctAnswers + ' out of ' + totalQuestions;
}
