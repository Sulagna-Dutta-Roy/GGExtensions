document.getElementById('plant-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const plantType = document.getElementById('plant-type').value;
    const lightType = document.getElementById('light-type').value;
    const watering = document.getElementById('watering').value;
    const soilType = document.getElementById('soil-type').value;
    const temperature = document.getElementById('temperature').value;

    let growthRate = calculateGrowthRate(plantType, lightType, watering, soilType, temperature);
    growthRate = growthRate.toFixed(2);

    document.getElementById('result').innerText = `Predicted growth rate for ${plantType}: ${growthRate} inches per month`;
});

function calculateGrowthRate(plantType, lightType, watering, soilType, temperature) {
    const BASE_GROWTH_RATES = {
        'succulents': 0.5,
        'ferns': 0.8,
        'flowering': 1,
        'vegetables': 1.2
    };

    const LIGHT_WEIGHTS = {
        'full_sunlight': 1.2,
        'partial_shade': 1,
        'indirect_light': 0.8
    };

    const SOIL_WEIGHTS = {
        'sandy': 0.8,
        'loamy': 1,
        'clay': 0.9
    };

    const WATERING_WEIGHT = 0.5;

    const baseGrowthRate = BASE_GROWTH_RATES[plantType];
    const lightFactor = LIGHT_WEIGHTS[lightType];
    const wateringFactor = Math.min(watering / 100, 1) * WATERING_WEIGHT;
    const soilFactor = SOIL_WEIGHTS[soilType];

    let temperatureFactor = 1;
    if (temperature < 10) {
        temperatureFactor = 0.8;
    } else if (temperature > 30) {
        temperatureFactor = 0.9;
    }

    return baseGrowthRate * ((lightFactor + wateringFactor + soilFactor + temperatureFactor) / 4);
}
