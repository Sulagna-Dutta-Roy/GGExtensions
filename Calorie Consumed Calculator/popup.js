document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("calorieForm");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const carbs = parseFloat(document.getElementById("carbs").value) || 0;
        const fruits = parseFloat(document.getElementById("fruits").value) || 0;
        const fats = parseFloat(document.getElementById("fats").value) || 0;
        const junks = parseFloat(document.getElementById("junks").value) || 0;
        const drinks = parseFloat(document.getElementById("drinks").value) || 0;
        const totalCalories = calculateTotalCalories(carbs, fruits, fats, junks, drinks);
        document.getElementById("result").innerText = `Total Calories: ${totalCalories}`;
    });
});

function calculateTotalCalories(carbs, fruits, fats, junks, drinks) {
    // Calorie counts per 100g for different food types (sample data)
    const calorieDatabase = {
        "carbs": 400,   // Sample values, replace with actual data
        "fruits": 50,
        "fats": 900,
        "junks": 300,
        "drinks": 50,   // Calories per 100ml
    };

    // Calculate total calories
    let totalCalories = 0;
    totalCalories += (calorieDatabase["carbs"] * carbs) / 100;
    totalCalories += (calorieDatabase["fruits"] * fruits) / 100;
    totalCalories += (calorieDatabase["fats"] * fats) / 100;
    totalCalories += (calorieDatabase["junks"] * junks) / 100;
    totalCalories += (calorieDatabase["drinks"] * drinks) / 100;

    return totalCalories.toFixed(2);
}
