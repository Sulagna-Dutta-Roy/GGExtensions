document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sin').addEventListener('click', () => calculate('sin'));
    document.getElementById('cos').addEventListener('click', () => calculate('cos'));
    document.getElementById('tan').addEventListener('click', () => calculate('tan'));
    document.getElementById('asin').addEventListener('click', () => calculate('asin'));
    document.getElementById('acos').addEventListener('click', () => calculate('acos'));
    document.getElementById('atan').addEventListener('click', () => calculate('atan'));
});

function calculate(func) {
    const angleInput = document.getElementById('angle').value;
    const unit = document.getElementById('unit').value;
    const angle = parseFloat(angleInput);

    if (isNaN(angle)) {
        alert("Please enter a valid angle.");
        return;
    }

    let angleInRadians;
    if (unit === "degrees" && ( func==="sin" || func==="cos" || func==="tan")) {
        angleInRadians = radians(angle);
        console.log("angle in radians: ", angleInRadians)
    } else {
        angleInRadians = angle;
    }

    let result;
    switch (func) {
        case 'sin':
            result = Math.sin(angleInRadians);
            break;
        case 'cos':
            result = Math.cos(angleInRadians);
            break;
        case 'tan':
            result = Math.tan(angleInRadians);
            break;
        case 'asin':
            result = Math.asin(angle);
            if (unit === "degrees") result = degrees(result);
            break;
        case 'acos':
            result = Math.acos(angle);
            if (unit === "degrees") result = degrees(result);
            break;
        case 'atan':
            result = Math.atan(angle);
            if (unit === "degrees") result = degrees(result);
            break;
    }

    result = result.toFixed(2)
    console.log(result, result==="NaN")

    document.getElementById('result').innerText = result!=="NaN" ? `Result: ${result}` : "Invalid operation!";
}

function radians(degrees) {
    return degrees * (Math.PI / 180);
}

function degrees(radians) {
    return radians * (180 / Math.PI);
}