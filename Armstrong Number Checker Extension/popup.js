document.getElementById("checkButton").addEventListener("click", function () {
  const number = document.getElementById("number").value;
  const resultDiv = document.getElementById("result");

  if (number === "") {
    resultDiv.textContent = "Please enter a number.";
    return;
  }

  const isArmstrong = checkArmstrongNumber(Number(number));
  resultDiv.textContent = isArmstrong
    ? `${number} is an Armstrong number.`
    : `${number} is not an Armstrong number.`;
});

function checkArmstrongNumber(num) {
  const digits = num.toString().split("");
  const numDigits = digits.length;
  let sum = 0;

  for (let digit of digits) {
    sum += Math.pow(Number(digit), numDigits);
  }

  return sum === num;
}
