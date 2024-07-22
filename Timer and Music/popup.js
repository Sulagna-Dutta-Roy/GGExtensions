document.addEventListener('DOMContentLoaded', function() {
    let startTimerBtn = document.getElementById('startTimer');
    startTimerBtn.addEventListener('click', function() {
        let duration = parseInt(document.getElementById('duration').value);
        let music = document.getElementById('music').value;

        if (duration > 0 && music !== '') {
            startTimer(duration, music);
        } else {
            alert('Please enter a valid duration and select music.');
        }
    });
});

function startTimer(duration, music) {
    let timerDisplay = document.getElementById('timerDisplay');
    timerDisplay.textContent = duration;

    playMusic(music);

    let countdown = setInterval(function() {
        duration--;
        timerDisplay.textContent = duration;

        if (duration <= 0) {
            clearInterval(countdown);
            timerDisplay.textContent = 'Time\'s up!';
            
        }
    }, 60000);
}

function playMusic(music) {
    
    let audio = new Audio();
    if (music === 'playlist1') {
        audio.src = 'playlist1.mp3'; 
    } else if (music === 'playlist2') {
        audio.src = 'playlist2.mp3'; 
    } else {
        
        audio.src = 'playlist3.mp3'; 
    }
    audio.loop = true; 
    audio.play();
}
