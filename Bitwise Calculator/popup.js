document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('andButton').addEventListener('click', function () { performOperation('and'); });
    document.getElementById('nandButton').addEventListener('click', function () { performOperation('nand'); });
    document.getElementById('orButton').addEventListener('click', function () { performOperation('or'); });
    document.getElementById('norButton').addEventListener('click', function () { performOperation('nor'); });
    document.getElementById('xorButton').addEventListener('click', function () { performOperation('xor'); });
    document.getElementById('xnorButton').addEventListener('click', function () { performOperation('xnor'); });
    document.getElementById('notButton').addEventListener('click', function () { performOperation('not'); });
    document.getElementById('leftshiftButton').addEventListener('click', function () { performOperation('leftshift'); });
    document.getElementById('rightshiftButton').addEventListener('click', function () { performOperation('rightshift'); });
});

function performOperation(operation) {
    const input1 = document.getElementById('input1').value;
    const input2 = document.getElementById('input2').value;
    let result;

    // Ensure input values are binary strings
    if (!/^[01]+$/.test(input1) || (input2 && !/^[01]+$/.test(input2))) {
        document.getElementById('result').value = 'Invalid input';
        return;
    }
    let l = Math.max(input1.length, input2.length)
    switch (operation) {
        case 'and':
            result = (parseInt(input1, 2) & parseInt(input2, 2)).toString(2);
            break;
        case 'nand':
            result = ((~(parseInt(input1, 2) & parseInt(input2, 2))) >>> 0).toString(2).slice(-l);
            break;
        case 'or':
            result = (parseInt(input1, 2) | parseInt(input2, 2)).toString(2);
            break;
        case 'nor':
            result = ((~(parseInt(input1, 2) | parseInt(input2, 2))) >>> 0).toString(2).slice(-l);
            break;
        case 'xor':
            result = (parseInt(input1, 2) ^ parseInt(input2, 2)).toString(2);
            break;
        case 'xnor':
            result = ((~(parseInt(input1, 2) ^ parseInt(input2, 2))) >>> 0).toString(2).slice(-l);
            break;
        case 'not':
            let bitLength = input1.length;
            result = (~parseInt(input1, 2) >>> 0).toString(2).slice(-bitLength);
            break;
        case 'leftshift':
            result = (parseInt(input1, 2) << 1).toString(2);
            break;
        case 'rightshift':
            result = (parseInt(input1, 2) >> 1).toString(2);
            break;
        default:
            result = 'Invalid operation';
    }

    document.getElementById('result').value = result;
}
