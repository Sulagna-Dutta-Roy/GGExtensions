let output = document.getElementById('output');
function display(num) {
    output.value += num;
}
function calculate() {
    try {
        output.value = eval(output.value);
    }
    catch (err) {
        alert('Invalid');
    }
}
function Clear() {
    output.value = "";
}
function del() {
    output.value = output.value.slice(0, -1);
}

document.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') {
        calculate();
    }
});

document.addEventListener('keydown', (e) => {
    if(e.key == 'numbers') {
        display(num);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key == 'Delete') {
        Clear();
    }
});