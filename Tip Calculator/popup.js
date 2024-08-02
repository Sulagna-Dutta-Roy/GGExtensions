document.getElementById('calculateButton').addEventListener('click', function() {
    const billAmount = parseFloat(document.querySelector('.js-amount-btn').value);
    const tipPercent = parseFloat(document.querySelector('.js-tip-btn').value);
    const noOfPeople = document.querySelector('.js-people-btn').value;
  
    if (isNaN(billAmount) || isNaN(tipPercent) || noOfPeople.trim() === '') {
      document.getElementById('result').textContent = 'Please enter valid numbers';
      return;
    }
  
    const tipAmount = billAmount * (tipPercent / 100);
    const totalAmount = billAmount + tipAmount;
    const eachPerson = tipAmount / noOfPeople;
  
    document.getElementById('result').textContent = `Tip: ₹${tipAmount.toFixed(2)}, Total: ₹${totalAmount.toFixed(2)},
    Tip Per Person: ₹${eachPerson.toFixed(2)}`;
  });
  