document.getElementById('calculate').addEventListener('click', function() {
    const weight = parseFloat(document.getElementById('weight').value) || 0;
    const height = parseFloat(document.getElementById('height').value) || 0;
    const age = parseFloat(document.getElementById('age').value) || 0;
    const gender = document.getElementById('gender').value;
    const activity = document.getElementById('activity').value;
    const goal = document.getElementById('goal').value;

    let bmr;

    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    let activityMultiplier;

    switch (activity) {
        case 'sedentary':
            activityMultiplier = 1.2;
            break;
        case 'light':
            activityMultiplier = 1.375;
            break;
        case 'moderate':
            activityMultiplier = 1.55;
            break;
        case 'active':
            activityMultiplier = 1.725;
            break;
        case 'very_active':
            activityMultiplier = 1.9;
            break;
        default:
            activityMultiplier = 1.2;
    }

    let dailyCalories = bmr * activityMultiplier;

    switch (goal) {
        case 'weight_loss':
            dailyCalories -= 500;
            break;
        case 'muscle_gain':
            dailyCalories += 500;
            break;
    }

    const protein = weight * 2;
    const fat = dailyCalories * 0.25 / 9;
    const carbs = (dailyCalories - (protein * 4) - (fat * 9)) / 4;

    document.getElementById('calories').value = dailyCalories.toFixed(2);
    document.getElementById('protein').value = protein.toFixed(2);
    document.getElementById('carbs').value = carbs.toFixed(2);
    document.getElementById('fat').value = fat.toFixed(2);
});

document.getElementById('reset').addEventListener('click', function() {
    document.getElementById('weight').value = '';
    document.getElementById('height').value = '';
    document.getElementById('age').value = '';
    document.getElementById('gender').value = 'male';
    document.getElementById('activity').value = 'sedentary';
    document.getElementById('goal').value = 'maintenance';
    document.getElementById('calories').value = '';
    document.getElementById('protein').value = '';
    document.getElementById('carbs').value = '';
    document.getElementById('fat').value = '';
});
