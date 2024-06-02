document.getElementById('calculateButton').addEventListener('click', calculateHeartRate);

function calculateHeartRate() {
    // Get values from input fields
    var age = parseInt(document.getElementById("age").value);
    var restingHeartRate = parseInt(document.getElementById("restingHeartRate").value);

    // Validate input
    if (isNaN(age) || isNaN(restingHeartRate) || age <= 0 || restingHeartRate <= 0) {
        alert("Please enter valid age and resting heart rate.");
        return;
    }

    // Calculate maximum heart rate using the formula: 220 - age
    var maxHeartRate = 220 - age;

    // Calculate target heart rate using the formula: (Max Heart Rate - Resting Heart Rate) * 0.6 + Resting Heart Rate
    var targetHeartRate = Math.round((maxHeartRate - restingHeartRate) * 0.6 + restingHeartRate);

    // Display the result
    document.getElementById("result").innerText = "Your target heart rate is: " + targetHeartRate + " beats per minute.";
}
