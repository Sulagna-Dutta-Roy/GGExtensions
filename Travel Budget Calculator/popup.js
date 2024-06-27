document.getElementById('calculate').addEventListener('click', function() {
    const flights = parseFloat(document.getElementById('flights').value) || 0;
    const accommodation = parseFloat(document.getElementById('accommodation').value) || 0;
    const nights = parseFloat(document.getElementById('nights').value) || 0;
    const food = parseFloat(document.getElementById('food').value) || 0;
    const days = parseFloat(document.getElementById('days').value) || 0;
    const activities = parseFloat(document.getElementById('activities').value) || 0;

    const accommodationTotal = accommodation * nights;
    const foodTotal = food * days;
    const totalCost = flights + accommodationTotal + foodTotal + activities;

    document.getElementById('result').value = totalCost.toFixed(2);
});

document.getElementById('reset').addEventListener('click', function() {
    document.getElementById('flights').value = '';
    document.getElementById('accommodation').value = '';
    document.getElementById('nights').value = '';
    document.getElementById('food').value = '';
    document.getElementById('days').value = '';
    document.getElementById('activities').value = '';
    document.getElementById('result').value = '';
});
