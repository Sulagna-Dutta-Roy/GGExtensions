// script.js

document.getElementById('validateButton').addEventListener('click', function() {
    const cardInput = document.getElementById('cardInput').value;
    const resultDiv = document.getElementById('result');

    // Remove any non-numeric characters
    const cardNumber = cardInput.replace(/\D/g, '');

    // Validate the card number using the Luhn algorithm
    if (isValidCardNumber(cardNumber)) {
        resultDiv.textContent = `${cardInput} is a valid credit card number.`;
        resultDiv.style.color = 'green';
    } else {
        resultDiv.textContent = `${cardInput} is not a valid credit card number.`;
        resultDiv.style.color = 'red';
    }
});

function isValidCardNumber(cardNumber) {
    if (cardNumber.length < 13 || cardNumber.length > 19) {
        return false;
    }
    let sum = 0;
    let shouldDouble = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return (sum % 10) === 0;
}
