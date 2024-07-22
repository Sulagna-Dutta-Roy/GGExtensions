document.addEventListener('DOMContentLoaded', function() {
    let startButton = document.getElementById('startButton');
    let instruction = document.getElementById('instruction');
    let result = document.getElementById('result');
    let startTime, endTime, timer;
  
    startButton.addEventListener('click', function() {
      instruction.textContent = 'Wait for green...';
      startButton.disabled = true;
      result.textContent = '';
  
      // Random time between 1.5 and 4.5 seconds
      let randomTime = Math.floor(Math.random() * 3000) + 1500;
  
      timer = setTimeout(function() {
        instruction.textContent = 'Click Anywhere!';
        startTime = Date.now();
        document.body.style.backgroundColor = 'green';
      }, randomTime);
    });
  
    document.addEventListener('click', function() {
      if (document.body.style.backgroundColor === 'green') {
        endTime = Date.now();
        let reactionTime = endTime - startTime;
        result.textContent = `Your reaction time is ${reactionTime} ms`;
        document.body.style.backgroundColor = 'white';
        instruction.textContent = 'Click "Start" to try again';
        startButton.disabled = false;
        clearTimeout(timer);
      }
    });
  });
  