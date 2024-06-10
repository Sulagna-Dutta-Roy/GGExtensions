document.addEventListener("DOMContentLoaded", function() {
    const valueInput = document.getElementById('value');
    const sourceUnitSelect = document.getElementById('sourceUnit');
    const targetUnitSelect = document.getElementById('targetUnit');

    valueInput.addEventListener('input', convert);
    sourceUnitSelect.addEventListener('change', convert);
    targetUnitSelect.addEventListener('change', convert);
});

function convert() {
    // Get values from input and dropdowns
    const inputValue = parseFloat(document.getElementById('value').value);
    const sourceUnit = document.getElementById('sourceUnit').value;
    const targetUnit = document.getElementById('targetUnit').value;

    // Check if inputValue is a valid number
    if (isNaN(inputValue)) {
        document.getElementById('result').innerText = 'Please enter a valid number';
        return;
    }

    // Perform the conversion
    let result;

    if (sourceUnit === 'px' && targetUnit === 'rem') {
        result = inputValue / 16;
    } else if (sourceUnit === 'rem' && targetUnit === 'px') {
        result = inputValue * 16;
    } else if (sourceUnit === 'px' && targetUnit === 'em') {
        result = inputValue / 16;
    } else if (sourceUnit === 'em' && targetUnit === 'px') {
        result = inputValue * 16;
    } else if (sourceUnit === 'em' && targetUnit === 'rem') {
        result = inputValue / 1.6;
    } else if (sourceUnit === 'rem' && targetUnit === 'em') {
        result = inputValue * 1.6;
    } else if (sourceUnit === 'px' && targetUnit === 'vw') {
        result = (inputValue / document.documentElement.clientWidth) * 100;
    } else if (sourceUnit === 'vw' && targetUnit === 'px') {
        result = (inputValue * document.documentElement.clientWidth) / 100;
    } else if (sourceUnit === 'px' && targetUnit === 'vh') {
        result = (inputValue / document.documentElement.clientHeight) * 100;
    } else if (sourceUnit === 'vh' && targetUnit === 'px') {
        result = (inputValue * document.documentElement.clientHeight) / 100;
    } else if (sourceUnit === 'em' && targetUnit === 'vw') {
        result = (inputValue * 16 / document.documentElement.clientWidth) * 100;
    } else if (sourceUnit === 'vw' && targetUnit === 'em') {
        result = ((inputValue / 100) * document.documentElement.clientWidth) / 16;
    } else {
        result = inputValue; // If the units are the same, no conversion needed
    }

    // Display the result
    document.getElementById('result').innerText = result.toFixed(2) + ' ' + targetUnit;
}
