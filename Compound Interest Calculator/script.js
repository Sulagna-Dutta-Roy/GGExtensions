function compoundInterest() {
  const principalAmount = document.querySelector('.js-principal').value;
  const interestRate = document.querySelector('.js-interest-rate').value;
  const years = document.querySelector('.js-years').value;

  document.querySelector('.js-result').style.display = 'block';

  let calculatedValue;

  console.log(principalAmount);

  if(principalAmount !== '' && interestRate !== '' && years !== ''){
    calculatedValue = principalAmount * Math.pow((1 + interestRate / 100), years) - principalAmount;

    document.querySelector('.js-result').innerHTML = `Compound Interest: ₹${calculatedValue.toFixed(2)}`;
  }else {
    document.querySelector('.js-result').innerHTML = 'Please enter valid input values';
  }
}

document.querySelector('.js-submit')
  .addEventListener('click', () => {
    compoundInterest();
  });