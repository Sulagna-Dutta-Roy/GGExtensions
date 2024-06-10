document.getElementById('validateButton').addEventListener('click', function() {
    const isbnInput = document.getElementById('isbnInput').value;
    const resultDiv = document.getElementById('result');

    // Remove any hyphens from the input
    const isbn = isbnInput.replace(/-/g, '');

    // Check if the input is a valid ISBN-10 or ISBN-13
    if (isValidISBN10(isbn)) {
        resultDiv.textContent = `${isbnInput} is a valid ISBN-10.`;
        resultDiv.style.color = 'green';
    } else if (isValidISBN13(isbn)) {
        resultDiv.textContent = `${isbnInput} is a valid ISBN-13.`;
        resultDiv.style.color = 'green';
    } else {
        resultDiv.textContent = `${isbnInput} is not a valid ISBN.`;
        resultDiv.style.color = 'red';
    }
});

function isValidISBN10(isbn) {
    if (isbn.length !== 10 || !/^\d{9}[\dX]$/.test(isbn)) {
        return false;
    }
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += (i + 1) * parseInt(isbn[i]);
    }
    let checksum = isbn[9] === 'X' ? 10 : parseInt(isbn[9]);
    sum += 10 * checksum;
    return sum % 11 === 0;
}

function isValidISBN13(isbn) {
    if (isbn.length !== 13 || !/^\d{13}$/.test(isbn)) {
        return false;
    }
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        sum += parseInt(isbn[i]) * (i % 2 === 0 ? 1 : 3);
    }
    let checksum = (10 - (sum % 10)) % 10;
    return checksum === parseInt(isbn[12]);
}
