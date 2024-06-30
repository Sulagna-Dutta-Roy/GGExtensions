function isIsogram(word) {
    word = word.toLowerCase();
    let charSet = new Set();
    for (let char of word) {
        if (charSet.has(char)) {
            return false;
        }
        charSet.add(char);
    }
    return true;
}

function checkIsogram() {
    const wordInput = document.getElementById('wordInput').value;
    const result = document.getElementById('result');

    if (wordInput === '') {
        result.textContent = 'Please enter a word.';
        result.style.color = 'red';
    } else if (isIsogram(wordInput)) {
        result.textContent = `"${wordInput}" is an isogram!`;
        result.style.color = 'green';
    } else {
        result.textContent = `"${wordInput}" is not an isogram.`;
        result.style.color = 'red';
    }
}
