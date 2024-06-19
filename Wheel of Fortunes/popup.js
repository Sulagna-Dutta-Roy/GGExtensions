document.addEventListener('DOMContentLoaded', function() {
    const wheel = document.getElementById('wheel');
    const spinButton = document.getElementById('spin');
    const resultDiv = document.getElementById('result');
    
    const segments = ["100", "200", "300", "400", "500", "600", "700", "800", "900", "1000"];
    const numSegments = segments.length;
    const segmentAngle = 360 / numSegments;
    
    // Generate wheel segments
    for (let i = 0; i < numSegments; i++) {
      const segment = document.createElement('div');
      segment.style.transform = `rotate(${i * segmentAngle}deg) skewY(-60deg)`;
      segment.textContent = segments[i];
      wheel.appendChild(segment);
    }
    
    // Handle spin button click
    spinButton.addEventListener('click', function() {
      const randomIndex = Math.floor(Math.random() * numSegments);
      const rotateAngle = (randomIndex * segmentAngle) + (360 * 5); // Rotate 5 times plus random segment
      wheel.style.transition = 'transform 4s ease-out';
      wheel.style.transform = `rotate(${rotateAngle}deg)`;
      
      setTimeout(() => {
        resultDiv.textContent = `You won $${segments[randomIndex]}!`;
      }, 4000); // Delay to match spin duration
    });
  });
  