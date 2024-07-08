document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calculateButton').addEventListener('click', calculateAngle);
});

function calculateAngle() {
    const time = document.getElementById("time").value.trim();

    if (!isValidTimeFormat(time)) {
        document.getElementById("output-text").innerText = "Please enter time in HH:MM format.";
        return;
    }
    const [hours, minutes] = time.split(':').map(Number);


    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        document.getElementById("output-text").innerText = "Invalid time. Please enter valid hours (0-23) and minutes (0-59).";
        return;
    }

    // Calculate the angles
    const hourAngle = (hours % 12 + minutes / 60) * 30; // Each hour makes 30 degrees
    const minuteAngle = minutes * 6; // Each minute makes 6 degrees

    // Calculate the angle between the hands
    let angle = Math.abs(hourAngle - minuteAngle);
    angle = Math.min(360 - angle, angle); // Get the smaller angle between the two possibilities

    document.getElementById("output-text").innerText = `Angle between the clock hands at ${time} is ${angle.toFixed(2)} degrees.`;
}

function isValidTimeFormat(time) {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
}
