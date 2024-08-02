document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calculateButton').addEventListener('click', calculateCaloricIntake);
});

function calculateCaloricIntake() {
    const age = Math.max(0, parseInt(document.getElementById('age').value, 10));
    const gender = document.getElementById('gender').value;
    const weight = Math.max(0, parseFloat(document.getElementById('weight').value));
    const height = Math.max(0, parseFloat(document.getElementById('height').value));
    const activityLevel = document.getElementById('activityLevel').value;
    const weightGoal = document.getElementById('weightGoal').value;

    // Check for negative values
    if (age <= 0 || weight <= 0 || height <= 0) {
        alert('Please enter values greater than 0 for age, weight, and height.');
        return;
    }

    
    let bmr;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else if (gender === 'female') {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

   
    let tdee;
    switch (activityLevel) {
        case 'sedentary':
            tdee = bmr * 1.2;
            break;
        case 'lightlyActive':
            tdee = bmr * 1.375;
            break;
        case 'moderatelyActive':
            tdee = bmr * 1.55;
            break;
        case 'veryActive':
            tdee = bmr * 1.725;
            break;
        case 'extraActive':
            tdee = bmr * 1.9;
            break;
        default:
            tdee = bmr; // Default case if no activity level is selected
            break;
    }

    // Adjust TDEE based on weight goal
    let caloricIntake;
    switch (weightGoal) {
        case 'maintain':
            caloricIntake = tdee;
            break;
        case 'lose':
            caloricIntake = tdee - 500; // Create a calorie deficit for weight loss
            break;
        case 'gain':
            caloricIntake = tdee + 500; // Create a calorie surplus for weight gain
            break;
        default:
            caloricIntake = tdee; // Default case if no weight goal is selected
            break;
    }

    document.getElementById('result').innerHTML = `<p>Your estimated daily calorie intake: ${caloricIntake.toFixed(2)} calories</p>`;
}
