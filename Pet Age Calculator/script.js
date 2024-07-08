document.getElementById('ageForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const petType = document.getElementById('petType').value;
  const humanYears = parseFloat(document.getElementById('humanYears').value);
  let petYears = 0;
  
  switch(petType) {
      case 'dog':
          petYears = humanYears * 7;
          break;
      case 'cat':
          petYears = humanYears * 6;
          break;
      case 'rabbit':
          petYears = humanYears * 12; 
          break;
      case 'fish':
          petYears = humanYears * 5; 
          break;
      default:
          petYears = 0;
  }
  
  document.getElementById('result').textContent = `Your ${petType} is ${petYears.toFixed(1)} years old in pet years.`;
});
