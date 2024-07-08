document.getElementById('calculateButton').addEventListener('click', calculateStatistics);

function calculateStatistics() {
    const numbers = getNumbers();
    if (numbers.length === 0) return;

    const mean = calculateMean(numbers);
    const median = calculateMedian(numbers);
    const mode = calculateMode(numbers);

    displayResult(`Mean: ${mean}, Median: ${median}, Mode: ${mode.join(', ')}`);
}

function calculateMean(numbers) {
    const sum = numbers.reduce((a, b) => a + b, 0);
    return (sum / numbers.length).toFixed(2);
}

function calculateMedian(numbers) {
    numbers.sort((a, b) => a - b);
    const mid = Math.floor(numbers.length / 2);

    if (numbers.length % 2 === 0) {
        return ((numbers[mid - 1] + numbers[mid]) / 2).toFixed(2);
    } else {
        return numbers[mid].toFixed(2);
    }
}

function calculateMode(numbers) {
    const frequency = {};
    numbers.forEach(num => frequency[num] = (frequency[num] || 0) + 1);

    let maxFreq = 0;
    let mode = [];
    for (const key in frequency) {
        if (frequency[key] > maxFreq) {
            maxFreq = frequency[key];
            mode = [Number(key)];
        } else if (frequency[key] === maxFreq) {
            mode.push(Number(key));
        }
    }

    if (mode.length === numbers.length) {
        return ["No mode"];
    }

    return mode;
}

function getNumbers() {
    const input = document.getElementById('numbers').value;
    if (!input) {
        displayResult('Please enter a set of numbers.');
        return [];
    }

    const numbers = input.split(',').map(num => parseFloat(num.trim()));
    if (numbers.some(isNaN)) {
        displayResult('Please enter valid numbers.');
        return [];
    }

    return numbers;
}

function displayResult(message) {
    document.getElementById('result').textContent = message;
}
