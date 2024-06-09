document.getElementById('convert').addEventListener('click', function() {
  const euroAmount = parseFloat(document.getElementById('euro').value);
  const exchangeRate = 1.08;
  if (!isNaN(euroAmount)) {
    const usdAmount = (euroAmount * exchangeRate).toFixed(2);
    document.getElementById('result').textContent = `${euroAmount} Euro = ${usdAmount} USD`;
  } else {
    document.getElementById('result').textContent = 'Please enter a valid number.';
  }
});
