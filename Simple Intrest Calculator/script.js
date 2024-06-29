function calculateInterest() {
    var principal = document.getElementById('principal').value;
    var rate = document.getElementById('rate').value;
    var time = document.getElementById('time').value;

    if (principal && rate && time) {
        var interest = (principal * rate * time) / 100;
        document.getElementById('interest').innerText = interest.toFixed(2);
    } else {
        alert('Please fill in all fields');
    }
}
