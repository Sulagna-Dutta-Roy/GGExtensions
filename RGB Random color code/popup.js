const generateButton = document.getElementById('generate-button');
const colorDisplay = document.getElementById('color-display');

generateButton.addEventListener('click', generateColor);

function generateColor() {
  // Generate random numbers for red, green, and blue values (0-255)
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

  const rgbColor = `rgb(${red}, ${green}, ${blue})`;
  colorDisplay.style.backgroundColor = rgbColor;

  // Display the RGB code as text
  colorDisplay.textContent = `RGB: ${red}, ${green}, ${blue}`;
}
