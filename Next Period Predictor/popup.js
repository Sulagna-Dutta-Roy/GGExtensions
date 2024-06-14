document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calculate').addEventListener('click', calculateNextPeriod);
    document.getElementById('close').addEventListener('click', closePopup);
  });
  
  function calculateNextPeriod() {
    const lastPeriod = document.getElementById('lastPeriod').value;
    const cycleLength = parseInt(document.getElementById('cycleLength').value);
  
    if (lastPeriod && cycleLength) {
      const lastPeriodDate = new Date(lastPeriod);
      const nextPeriodDate = new Date(lastPeriodDate.getTime() + cycleLength * 24 * 60 * 60 * 1000);
      const today = new Date();
  
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = nextPeriodDate.toLocaleDateString('en-US', options);
  
      const resultElement = document.getElementById('result');
  
      if (nextPeriodDate < today) {
        resultElement.innerHTML = `Your next period was expected on <span class="late">${formattedDate}</span>. You are late.`;
      } else {
        resultElement.innerHTML = `Your next period is expected on <span class="on-time">${formattedDate}</span>.`;
      }
    } else {
      document.getElementById('result').textContent = 'Please fill in all fields.';
    }
  }
  
  function closePopup() {
    window.close();
  }
  