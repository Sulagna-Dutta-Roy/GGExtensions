document.getElementById('calculate').addEventListener('click', function() {
    const rainfall = parseFloat(document.getElementById('rainfall').value) || 0;
    const soilType = document.getElementById('soil-type').value;
    const slope = parseFloat(document.getElementById('slope').value) || 0;

    // Erosion factors based on soil type
    const soilFactors = {
        clay: 1.2,
        silt: 1.0,
        sand: 0.8
    };

    // Basic calculation for erosion rate
    const erosionRate = rainfall * soilFactors[soilType] * (1 + slope / 100);

    document.getElementById('result').value = erosionRate.toFixed(2);
});

document.getElementById('reset').addEventListener('click', function() {
    document.getElementById('rainfall').value = '';
    document.getElementById('soil-type').value = 'clay';
    document.getElementById('slope').value = '';
    document.getElementById('result').value = '';
});
