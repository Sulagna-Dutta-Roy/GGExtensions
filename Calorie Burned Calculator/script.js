document.getElementById('calculateButton').addEventListener('click', calculateCalories);

function calculateCalories() {
    var activity = parseFloat(document.getElementById('activity').value);
    var weight = parseFloat(document.getElementById('weight').value);
    var duration = parseFloat(document.getElementById('duration').value);

    if (isNaN(activity) || isNaN(weight) || isNaN(duration)) {
        document.getElementById('result').innerHTML = 'Please enter valid numbers for all fields.';
        return;
    }

    var caloriesBurned = activity * weight * duration;
    document.getElementById('result').innerHTML = 'Calories Burned: ' + caloriesBurned.toFixed(2) + ' calories';
}
