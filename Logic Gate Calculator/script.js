function handleGateChange() {
    const gate = document.getElementById('gate').value;
    const input2 = document.getElementById('input2');
    const labelInput2 = document.getElementById('labelInput2');
    
    if (gate === 'NOT') {
        input2.style.display = 'none';
        labelInput2.style.display = 'none';
    } else {
        input2.style.display = 'inline-block';
        labelInput2.style.display = 'inline-block';
    }
}

function decimalToBinary(decimal) {
    return (decimal >>> 0).toString(2);
}

function binaryToDecimal(binary) {
    return parseInt(binary, 2) || 0; // Return 0 if binary string is empty
}

function calculate() {
    const input1 = parseInt(document.getElementById('input1').value, 10);
    const input2 = parseInt(document.getElementById('input2').value, 10);
    const gate = document.getElementById('gate').value;

    let binary1 = decimalToBinary(input1);
    let binary2 = decimalToBinary(input2);
    let resultBinary;

    // Ensure binary strings are of the same length by padding with leading zeros
    const maxLength = Math.max(binary1.length, binary2.length);
    binary1 = binary1.padStart(maxLength, '0');
    binary2 = binary2.padStart(maxLength, '0');

    switch (gate) {
        case 'AND':
            resultBinary = [...binary1].map((bit, index) => (bit === '1' && binary2[index] === '1') ? '1' : '0').join('');
            break;
        case 'OR':
            resultBinary = [...binary1].map((bit, index) => (bit === '1' || binary2[index] === '1') ? '1' : '0').join('');
            break;
        case 'NOT':
            resultBinary = [...binary1].map(bit => (bit === '1') ? '0' : '1').join('');
            break;
        case 'NAND':
            resultBinary = [...binary1].map((bit, index) => (bit === '1' && binary2[index] === '1') ? '0' : '1').join('');
            break;
        case 'NOR':
            resultBinary = [...binary1].map((bit, index) => (bit === '0' && binary2[index] === '0') ? '1' : '0').join('');
            break;
        case 'XOR':
            resultBinary = [...binary1].map((bit, index) => (bit !== binary2[index]) ? '1' : '0').join('');
            break;
        case 'XNOR':
            resultBinary = [...binary1].map((bit, index) => (bit === binary2[index]) ? '1' : '0').join('');
            break;
    }

    // Convert result binary to decimal
    const resultDecimal = binaryToDecimal(resultBinary);

    // Display the result
    document.getElementById('result').textContent = resultDecimal;
}

// Initialize the gate change handler to set the correct display for input2
handleGateChange();
