<script>
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('survey-form');
    const questionsContainer = document.getElementById('questions-container');
    const addQuestionButton = document.getElementById('add-question');

    let questionCount = 1;

    addQuestionButton.addEventListener('click', () => {
        questionCount++;
        const newQuestion = document.createElement('div');
        newQuestion.classList.add('form-group');
        newQuestion.innerHTML = `
            <label for="question-${questionCount}">Question ${questionCount}</label>
            <input type="text" id="question-${questionCount}" name="questions[]" required>
        `;
        questionsContainer.appendChild(newQuestion);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const surveyData = {
            title: formData.get('title'),
            questions: formData.getAll('questions[]')
        };
        console.log('Survey Created:', surveyData);
        alert('Survey Created! Check the console for details.');
        form.reset();
        questionsContainer.innerHTML = `
            <div class="form-group">
                <label for="question-1">Question 1</label>
                <input type="text" id="question-1" name="questions[]" required>
            </div>
        `;
        questionCount = 1;
    });
});
</script>
