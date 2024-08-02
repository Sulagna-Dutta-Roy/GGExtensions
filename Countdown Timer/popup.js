function padNumber(number) {
    return number.toString().padStart(2, '0');
}

let countdownInterval; 

function startCountdown() {
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    const hoursInput = document.getElementById('hours');

    let totalMinutes = parseInt(minutesInput.value) || 0;
    let totalSeconds = parseInt(secondsInput.value) || 0;
    let totalHours = parseInt(hoursInput.value) || 0;

    let totalTimeInSeconds = totalHours * 3600 + totalMinutes * 60 + totalSeconds;

    const countdownForm = document.getElementById('countdownForm');

    countdownForm.querySelectorAll('input').forEach(element => {
        element.disabled = true;
    });

    document.getElementById('stopButton').disabled = false;

    function updateCountdown() {
        const hours = Math.floor(totalTimeInSeconds / 3600);
        const minutes = Math.floor((totalTimeInSeconds % 3600) / 60);
        const seconds = totalTimeInSeconds % 60;

        hoursInput.value = padNumber(hours);
        minutesInput.value = padNumber(minutes);
        secondsInput.value = padNumber(seconds);

        if (totalTimeInSeconds > 0) {
            totalTimeInSeconds--; 
        } else {
          
            clearInterval(countdownInterval);
            alert("Time's up!");
           
            countdownForm.querySelectorAll('input').forEach(element => {
                element.disabled = false;
            });
         
            document.getElementById('stopButton').disabled = true;
        }
    }

  
    updateCountdown();
 
    countdownInterval = setInterval(updateCountdown, 1000);
}

function stopCountdown() {
  
    clearInterval(countdownInterval);

    const countdownForm = document.getElementById('countdownForm');
    countdownForm.querySelectorAll('input').forEach(element => {
        element.disabled = false;
    });

    document.getElementById('stopButton').disabled = true;
}