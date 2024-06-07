document.getElementById('calculate').addEventListener('click', function() {
  var weight = document.getElementById('weight').value;
  var planet = document.getElementById('planet').value;
  if (weight <= 0) {
    document.getElementById('result').innerHTML = "Hmm, it seems you've discovered anti-gravity! Please enter a positive weight.";
  } else {
    var result = weight * planet;
    document.getElementById('result').innerHTML = "Your weight on this planet/moon would be: " + result.toFixed(2) + " kg";
  }
});
