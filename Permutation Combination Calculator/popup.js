document.getElementById('calcPerm').addEventListener('click', calculatePermutations);
document.getElementById('calcComb').addEventListener('click', calculateCombinations);

function calculatePermutations() {
    const n = parseInt(document.getElementById('n').value);
    const r = parseInt(document.getElementById('r').value);

    if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n) {
        document.getElementById('result').innerText = 'Please enter valid values for n and r.';
        return;
    }

    const permutations = factorial(n) / factorial(n - r);
    document.getElementById('result').innerText = `Permutations (P): ${permutations}`;
}

function calculateCombinations() {
    const n = parseInt(document.getElementById('n').value);
    const r = parseInt(document.getElementById('r').value);

    if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n) {
        document.getElementById('result').innerText = 'Please enter valid values for n and r.';
        return;
    }

    const combinations = factorial(n) / (factorial(r) * factorial(n - r));
    document.getElementById('result').innerText = `Combinations (C): ${combinations}`;
}

function factorial(num) {
    if (num === 0) return 1;
    let result = 1;
    for (let i = num; i > 1; i--) {
        result *= i;
    }
    return result;
}
