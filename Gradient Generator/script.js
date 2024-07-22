let colorOne = document.getElementById('color-a');
let colorTwo = document.getElementById('color-b');
let currentDirection = 'to bottom';
let outputCode = document.getElementById('code');

document.getElementById('to-top').addEventListener('click', function() {
    setDirection('to top', this);
});
document.getElementById('to-bottom').addEventListener('click', function() {
    setDirection('to bottom', this);
});
document.getElementById('to-right').addEventListener('click', function() {
    setDirection('to right', this);
});
document.getElementById('to-left').addEventListener('click', function() {
    setDirection('to left', this);
});
document.getElementById('to-top-right').addEventListener('click', function() {
    setDirection('to top right', this);
});
document.getElementById('to-bottom-left').addEventListener('click', function() {
    setDirection('to bottom left', this);
});
document.getElementById('to-bottom-right').addEventListener('click', function() {
    setDirection('to bottom right', this);
});
document.getElementById('to-top-left').addEventListener('click', function() {
    setDirection('to top left', this);
});

function setDirection(value, _this) {
    let buttons = document.querySelectorAll('.buttons button');
    buttons.forEach(function(button) {
        button.classList.remove('active');
    });
    _this.classList.add('active');
    currentDirection = value;
}

function generateCode() {
    outputCode.value = `background-image: linear-gradient(${currentDirection}, ${colorOne.value}, ${colorTwo.value});`;

    document.getElementsByTagName("BODY")[0].style.backgroundImage = `linear-gradient(${currentDirection}, ${colorOne.value}, ${colorTwo.value})`;
}
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("submit").addEventListener("click", generateCode);
});

function copyText() {
    outputCode.select();
    document.execCommand('copy');
    alert('Gradient Copied!');
}

generateCode();
