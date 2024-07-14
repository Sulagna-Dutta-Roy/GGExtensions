document.getElementById('calculate-btn').addEventListener('click', function() {
    const num1 = parseInt(document.getElementById('input1').value);
    const num2 = parseInt(document.getElementById('input2').value);

    if (isNaN(num1) || isNaN(num2) || num1 < 0 || num2 < 0) {
        document.getElementById('popup').classList.add('active');
        setTimeout(function() {
            document.getElementById('popup').classList.remove('active');
        }, 3000); // Hide popup after 3 seconds
    } else {
        const hcf = calculateHCF(num1, num2);
        document.getElementById('result').innerText = `HCF of ${num1} and ${num2} is ${hcf}`;
    }
});

function calculateHCF(a, b) {
    if (b === 0) {
        return a;
    }
    return calculateHCF(b, a % b);
}
