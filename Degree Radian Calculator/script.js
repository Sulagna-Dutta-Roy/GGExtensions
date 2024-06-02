var radEl = document.getElementById("radian"),
    gradEl = document.getElementById("degree");

radEl.addEventListener("keyup", function (e) {
    var grad = (parseFloat(e.target.value, 10) * 180) / Math.PI;
    gradEl.value = !isNaN(grad) ? grad.toFixed(3) : "";

});

gradEl.addEventListener("keyup", function (e) {
    var rad = (parseFloat(e.target.value, 10) * Math.PI) / 180;
    radEl.value = !isNaN(rad) ? rad.toFixed(4) : "";

});
