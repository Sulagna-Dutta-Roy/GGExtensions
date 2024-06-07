document.getElementById('start-break').addEventListener('click', () => {
    document.getElementById('breathing-exercise').classList.remove('hidden');
    document.getElementById('meditation-session').classList.add('hidden');
    document.getElementById('stretching-routine').classList.add('hidden');
    startBreathingExercise();
    playCalmingSounds();
});

document.getElementById('start-meditation').addEventListener('click', () => {
    document.getElementById('breathing-exercise').classList.add('hidden');
    document.getElementById('meditation-session').classList.remove('hidden');
    document.getElementById('stretching-routine').classList.add('hidden');
    playCalmingSounds();
});

document.getElementById('start-stretching').addEventListener('click', () => {
    document.getElementById('breathing-exercise').classList.add('hidden');
    document.getElementById('meditation-session').classList.add('hidden');
    document.getElementById('stretching-routine').classList.remove('hidden');
    playCalmingSounds();
});

document.getElementById('customize').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
});

function startBreathingExercise() {
    const message = document.querySelector('#breathing-exercise p');
    let cycle = 0;

    function updateMessage() {
        if (cycle % 2 === 0) {
            message.textContent = 'Breathe in...';
        } else {
            message.textContent = 'Breathe out...';
        }
        cycle++;
    }

    setInterval(updateMessage, 4000);
}

function playCalmingSounds() {
    const audio = new Audio('meditation.mp3');
    audio.play();
}
