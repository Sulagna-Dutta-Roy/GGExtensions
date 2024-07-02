function convertAngle() {
    let angle = document.getElementById("angleInput").value;
    let type = document.getElementById("angleType").value;
    let resultElement = document.getElementById("result");

    if (angle === "") {
        resultElement.innerHTML = "<p>Please enter an angle value.</p>";
        return;
    }

    angle = parseFloat(angle);

    if (type === "degrees") {
        let radians = angle * (Math.PI / 180);
        resultElement.innerHTML = `<p>${angle} degrees is equal to ${radians.toFixed(4)} radians.</p>`;
    } else if (type === "radians") {
        let degrees = angle * (180 / Math.PI);
        resultElement.innerHTML = `<p>${angle} radians is equal to ${degrees.toFixed(4)} degrees.</p>`;
    }
}

