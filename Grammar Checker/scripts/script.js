document.getElementById('check-button').addEventListener('click', function () {
    const text = document.getElementById('text-input').value;

    if (text.trim() === '') {
        alert('Please enter some text.');
        return;
    }

    checkGrammar(text);
});

function checkGrammar(text) {
    fetch('https://api.languagetoolplus.com/v2/check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `text=${encodeURIComponent(text)}&language=en-US`
    })
        .then(response => response.json())
        .then(data => {
            displayResults(data.matches);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayResults(matches) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (matches.length === 0) {
        resultsContainer.innerHTML = '<p>No grammar issues found.</p>';
        return;
    }

    matches.forEach(match => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result';

        const errorSpan = document.createElement('span');
        errorSpan.className = 'error';
        errorSpan.textContent = match.message;

        resultDiv.appendChild(errorSpan);
        resultsContainer.appendChild(resultDiv);
    });
}
