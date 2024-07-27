function calculate() {
    // Get input values
    const value = document.getElementById('value').value;
    const base = document.getElementById('base').value;

    // Perform the selected calculation
    let result;
    result = Math.pow(base,value)

    // Display the result
    const resultElement = document.getElementById('result');
    resultElement.textContent = result;
}