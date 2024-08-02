
const input = document.querySelector('input');
const output = document.getElementById('show-output');


input.addEventListener('input', () => {
    if (input.value !== '') {
        let num = parseInt(input.value);
        calcFactorial(num);
    } else {
        output.textContent = '';
    }
});

function calcFactorial(n) {
    let len = 1;
    let num = [1];
    for (let i = 1; i <= n; i++) {
        let c = 0;
        for (let j = 0; j < len; j++) {
            let k = num[j] * i + c;
            num[j] = k % 10;
            c = Math.floor(k / 10);
        }
        while (c) {
            num.push(c % 10);
            c = Math.floor(c / 10);
            len++;
        }
    }

    let result = '';
    for (let i = num.length - 1; i >= 0; i--)
        result += num[i];
    output.textContent = result;
}