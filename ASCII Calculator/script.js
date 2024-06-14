document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('getAsciiValueButton').addEventListener('click', displayAsciiValues);
    document.getElementById('clearButton').addEventListener('click', clearInput);

    document.forms["myform"]["charInput"].addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            displayAsciiValues();
        }
    });
});

function displayAsciiValues() {
    const charInput = document.forms["myform"]["charInput"].value;
    const asciiValueDiv = document.getElementById("asciiValue");

    asciiValueDiv.classList.remove('opacity-0'); // Reset animation
    void asciiValueDiv.offsetWidth; // Trigger reflow

    if (charInput.length > 0) {
        let asciiValues = [];
        for (let i = 0; i < charInput.length; i++) {
            asciiValues.push(`${charInput[i]}: ${charInput.charCodeAt(i)}`);
        }
        asciiValueDiv.innerHTML = asciiValues.join('<br>');
        asciiValueDiv.style.color = '#333';
        asciiValueDiv.classList.add('opacity-100');
    } else {
        asciiValueDiv.textContent = "Please enter a word or sentence.";
        asciiValueDiv.style.color = 'red';
        asciiValueDiv.classList.add('opacity-100');
    }
}

function clearInput() {
    document.forms["myform"]["charInput"].value = '';
    document.getElementById("asciiValue").textContent = '';
    document.getElementById("asciiValue").classList.remove('opacity-100');
}
