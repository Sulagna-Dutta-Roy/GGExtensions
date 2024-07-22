const digitToLetters = {
    '2': 'abc',
    '3': 'def',
    '4': 'ghi',
    '5': 'jkl',
    '6': 'mno',
    '7': 'pqrs',
    '8': 'tuv',
    '9': 'wxyz'
};

function generateCombinations() {
    const phoneNumber = document.getElementById('phone-number').value;
    const resultContainer = document.getElementById('combinations');
    resultContainer.innerHTML = '';

    if (!/^[2-9]+$/.test(phoneNumber)) {
        resultContainer.innerHTML = '<p>Please enter a valid phone number containing digits 2-9.</p>';
        return;
    }

    const combinations = getCombinations(phoneNumber);

    combinations.forEach(combination => {
        const p = document.createElement('p');
        p.textContent = combination;
        resultContainer.appendChild(p);
    });
}

function getCombinations(digits) {
    if (digits.length === 0) {
        return [];
    }
    if (digits.length === 1) {
        return digitToLetters[digits[0]].split('');
    }

    const prevCombinations = getCombinations(digits.slice(0, -1));
    const additionalLetters = digitToLetters[digits[digits.length - 1]];
    const newCombinations = [];

    prevCombinations.forEach(combination => {
        for (const letter of additionalLetters) {
            newCombinations.push(combination + letter);
        }
    });

    return newCombinations;
}
