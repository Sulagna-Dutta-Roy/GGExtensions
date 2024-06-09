document.addEventListener("DOMContentLoaded", function () {
    const shapeSelect = document.getElementById("shape");
    const lengthRow = document.getElementById("length-row");
    const widthRow = document.getElementById("width-row");
    const radiusRow = document.getElementById("radius-row");
    const baseRow = document.getElementById("base-row");
    const heightRow = document.getElementById("height-row");
    const resultDiv = document.getElementById("result");
    const calculateButton = document.getElementById("myButton");

    shapeSelect.addEventListener("change", showDimensions);
    calculateButton.addEventListener("click", calculateArea);

    function showDimensions() {
        const shape = shapeSelect.value;
        lengthRow.style.display = "none";
        widthRow.style.display = "none";
        radiusRow.style.display = "none";
        baseRow.style.display = "none";
        heightRow.style.display = "none";

        if (shape === "rectangle") {
            lengthRow.style.display = "block";
            widthRow.style.display = "block";
        } else if (shape === "square") {
            lengthRow.style.display = "block";
        } else if (shape === "circle") {
            radiusRow.style.display = "block";
        } else if (shape === "triangle") {
            baseRow.style.display = "block";
            heightRow.style.display = "block";
        }
    }

    function calculateArea() {
        const shape = shapeSelect.value;
        let area = 0;

        if (shape === "rectangle") {
            const length = parseFloat(document.getElementById("length").value);
            const width = parseFloat(document.getElementById("width").value);
            area = length * width;
        } else if (shape === "square") {
            const length = parseFloat(document.getElementById("length").value);
            area = length * length;
        } else if (shape === "circle") {
            const radius = parseFloat(document.getElementById("radius").value);
            area = Math.PI * radius * radius;
        } else if (shape === "triangle") {
            const base = parseFloat(document.getElementById("base").value);
            const height = parseFloat(document.getElementById("height").value);
            area = 0.5 * base * height;
        }

        resultDiv.innerText = `The area is ${area.toFixed(2)} square units.`;
    }
});
