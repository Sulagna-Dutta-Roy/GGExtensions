document.addEventListener('DOMContentLoaded', function() {
    const inputBox = document.getElementById('inputBox');
    const result = document.getElementById('result');
    let startTime;
  
    inputBox.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        const endTime = Date.now();
        const elapsedTime = (endTime - startTime) / 1000; // in seconds
  
        const typedNumber = parseInt(inputBox.value.trim());
        if (!isNaN(typedNumber)) {
          result.textContent = `You typed ${typedNumber} in ${elapsedTime} seconds.`;
        } else {
          result.textContent = 'Please enter a valid number.';
        }
  
        inputBox.value = '';
        startTime = Date.now();
      }
    });
  
    // Start timing when the page is loaded
    startTime = Date.now();
  });
  