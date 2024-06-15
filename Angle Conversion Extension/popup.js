document.getElementById("convert").addEventListener("click", function () {
  let degrees = parseFloat(document.getElementById("degrees").value);
  let radians = parseFloat(document.getElementById("radians").value);
  let gradians = parseFloat(document.getElementById("gradians").value);

  if (!isNaN(degrees)) {
    radians = degrees * (Math.PI / 180);
    gradians = degrees * (200 / 180);
  } else if (!isNaN(radians)) {
    degrees = radians * (180 / Math.PI);
    gradians = radians * (200 / Math.PI);
  } else if (!isNaN(gradians)) {
    degrees = gradians * (180 / 200);
    radians = gradians * (Math.PI / 200);
  }

  document.getElementById("degrees").value = degrees.toFixed(4);
  document.getElementById("radians").value = radians.toFixed(4);
  document.getElementById("gradians").value = gradians.toFixed(4);
});
