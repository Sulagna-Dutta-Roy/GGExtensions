const output = document.getElementById('output');

// Define references to buttons
const buttons = {
    clear: document.getElementById('clear'),
    delete: document.getElementById('delete'),
    percentage: document.getElementById('percentage'),
    divide: document.getElementById('divide'),
    seven: document.getElementById('seven'),
    eight: document.getElementById('eight'),
    nine: document.getElementById('nine'),
    add: document.getElementById('add'),
    four: document.getElementById('four'),
    five: document.getElementById('five'),
    six: document.getElementById('six'),
    subtract: document.getElementById('subtract'),
    one: document.getElementById('one'),
    two: document.getElementById('two'),
    three: document.getElementById('three'),
    multiply: document.getElementById('multiply'),
    zero: document.getElementById('zero'),
    doubleZero: document.getElementById('double-zero'),
    sqrt: document.getElementById('sqrt'),
    exponent: document.getElementById('exponent'),
    leftParen: document.getElementById('left-paren'),
    rightParen: document.getElementById('right-paren'),
    equals: document.getElementById('equals'),
    sin: document.getElementById('sin'),
    cos: document.getElementById('cos'),
    tan: document.getElementById('tan'),
    log: document.getElementById('log'),
    ln: document.getElementById('ln'),
    pi: document.getElementById('pi'),
    e: document.getElementById('e'),
    exp: document.getElementById('exp'),
    factorial: document.getElementById('factorial'),
    toggleMode: document.getElementById('toggle-mode')
};

const scientificButtons = document.querySelector('.scientific-buttons');
const basicButtons = document.querySelector('.basic-buttons');

buttons.toggleMode.addEventListener('click', () => {
    if (scientificButtons.style.display === 'none') {
        scientificButtons.style.display = 'grid';
        buttons.toggleMode.textContent = 'Basic Mode';
    } else {
        scientificButtons.style.display = 'none';
        buttons.toggleMode.textContent = 'Scientific Mode';
    }
});

// Add event listeners to the buttons
Object.values(buttons).forEach(button => {
    button.addEventListener('click', handleClick);
});

// Function to handle button clicks
function handleClick(event) {
    const buttonValue = event.target.textContent;
    switch (buttonValue) {
        case 'C':
            Clear();
            break;
        case 'DEL':
            del();
            break;
        case '√':
            sqrt();
            break;
        case 'sin':
        case 'cos':
        case 'tan':
        case 'log':
        case 'ln':
        case 'exp':
        case 'x!':
            handleScientific(buttonValue);
            break;
        case 'π':
            display(Math.PI.toFixed(10));
            break;
        case 'e':
            display(Math.E.toFixed(10));
            break;
        case '^':
        case '%':
        case '/':
        case '*':
        case '-':
        case '+':
        case '(':
        case ')':
            display(` ${buttonValue} `);
            break;
        case '=':
            calculate();
            break;
        default:
            display(buttonValue);
            break;
    }
}

// Function to display numbers and operators
function display(num) {
    output.value += num;
}

// Function to calculate the expression
function calculate() {
    const expression = output.value.trim();
    if (!isValidExpression(expression)) {
        output.value = "Invalid expression";
        return;
    }

    try {
        const result = evaluateExpression(expression);
        output.value = result;
    } catch (err) {
        output.value = "Invalid expression";
    }
}

// Function to check if the expression contains only valid characters and ends with a digit
function isValidExpression(expression) {
    const validCharactersRegex = /^[0-9+\-*/%^().\s]+$/;
    const endsWithDigit = /\d$/.test(expression);

    const tokens = expression.trim().split(/\s+/);

    for (let i = 0; i < tokens.length - 1; i++) {
        if (tokens[i].match(/[+\-*/%^]/) && tokens[i + 1].match(/[+\-*/%^]/)) {
            return false;
        }
    }

    return validCharactersRegex.test(expression) && endsWithDigit;
}

function evaluateExpression(expression) {
    const tokens = expression.split(/\s+/);
    const stack = [];
    const operators = [];

    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '%': 2,
        '^': 3
    };

    const applyOperator = () => {
        const operator = operators.pop();
        const b = stack.pop();
        const a = stack.pop();
        switch (operator) {
            case '+':
                stack.push(a + b);
                break;
            case '-':
                stack.push(a - b);
                break;
            case '*':
                stack.push(a * b);
                break;
            case '/':
                stack.push(a / b);
                break;
            case '%':
                stack.push(a % b);
                break;
            case '^':
                stack.push(Math.pow(a, b));
                break;
        }
    };

    tokens.forEach(token => {
        if (!isNaN(token)) {
            stack.push(parseFloat(token));
        } else if (token in precedence) {
            while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
                applyOperator();
            }
            operators.push(token);
        } else if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators[operators.length - 1] !== '(') {
                applyOperator();
            }
            operators.pop();
        }
    });

    while (operators.length) {
        applyOperator();
    }

    return stack[0];
}

// Function to handle scientific functions
function handleScientific(func) {
    const expression = output.value.trim();
    if (!expression || !isValidExpression(expression) || isNaN(expression)) {
        output.value = "Invalid input";
        return;
    }

    const number = parseFloat(expression);

    switch (func) {
        case 'sin':
            output.value = Math.sin(number).toFixed(10);
            break;
        case 'cos':
            output.value = Math.cos(number).toFixed(10);
            break;
        case 'tan':
            output.value = Math.tan(number).toFixed(10);
            break;
        case 'log':
            output.value = Math.log10(number).toFixed(10);
            break;
        case 'ln':
            output.value = Math.log(number).toFixed(10);
            break;
        case 'exp':
            output.value = Math.exp(number).toFixed(10);
            break;
        case 'x!':
            output.value = factorial(number);
            break;
    }
}

// Function to calculate square root
function sqrt() {
    const expression = output.value.trim();
    if (!expression || !isValidExpression(expression) || isNaN(expression)) {
        output.value = "Invalid input";
        return;
    }

    const number = parseFloat(expression);
    if (number < 0) {
        output.value = "Invalid input";
        return;
    }

    output.value = Math.sqrt(number).toFixed(10);
}

// Function to calculate factorial
function factorial(num) {
    if (num < 0) return "Invalid input";
    if (num === 0 || num === 1) return 1;
    let result = 1;
    for (let i = num; i > 1; i--) {
        result *= i;
    }
    return result;
}

// Function to clear the input
function Clear() {
    output.value = "";
}

// Function to delete the last character
function del() {
    output.value = output.value.slice(0, -1);
}

// Event listener for keyboard input
document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key >= '0' && key <= '9') {
        display(key);
    } else if (['+', '-', '*', '/', '%', '^', '(', ')'].includes(key)) {
        display(' ' + key + ' ');
    } else if (key === 'Enter') {
        e.preventDefault();
        calculate();
    } else if (key === 'Delete') {
        Clear();
    } else if (key === 'Backspace') {
        del();
    }
});
