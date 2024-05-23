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
    equals: document.getElementById('equals'),
};

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
        case '%':
        case '/':
        case '*':
        case '-':
        case '+':
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
    const expression = output.value.trim(); // Trim whitespace
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
    // Regular expression to match valid characters: digits, operators (+, -, *, /, %), and whitespace
    const validCharactersRegex = /^[0-9+\-*/%\s.]+$/;

    // Check if the expression ends with a digit
    const endsWithDigit = /\d$/.test(expression);

    // Split the expression into tokens
    const tokens = expression.trim().split(/\s+/);

    // Check for consecutive operators
    for (let i = 0; i < tokens.length - 1; i++) {
        if (tokens[i].match(/[+\-*/%]/) && tokens[i + 1].match(/[+\-*/%]/)) {
            return false; // Consecutive operators found, invalid expression
        }
    }

    return validCharactersRegex.test(expression) && endsWithDigit;
}


// Function to evaluate the expression without using eval()
function evaluateExpression(expression) {
    const tokens = expression.split(/\s+/); // Split expression by whitespace
    const stack = [];
    
    let currentOperator = '+';

    for (let token of tokens) {
        if (!isNaN(token)) {
            const number = parseFloat(token);
            switch (currentOperator) {
                case '+':
                    stack.push(number);
                    break;
                case '-':
                    stack.push(-number);
                    break;
                case '*':
                    stack.push(stack.pop() * number);
                    break;
                case '/':
                    stack.push(stack.pop() / number);
                    break;
                case '%':
                    stack.push(stack.pop() % number);
                    break;
            }
        } else {
            currentOperator = token;
        }
    }

    return stack.reduce((acc, num) => acc + num, 0);
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
        display(key); // Display the numeric key
    } else if (['+', '-', '*', '/', '%'].includes(key)) {
        display(' ' + key + ' '); // Display operators with spaces around them
    } else if (key === 'Enter') {
        e.preventDefault(); // Prevent the default action of Enter key (usually form submission)
        calculate(); // Calculate when Enter key is pressed
    } else if (key === 'Delete') {
        Clear(); // Clear the input when Delete key is pressed
    } else if (key === 'Backspace') {
        del(); // Delete the last character when Backspace key is pressed
    }
});

// Event listener for Delete key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Delete') {
        Clear();
    }
});
