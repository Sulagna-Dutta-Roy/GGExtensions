document.addEventListener('DOMContentLoaded', () => {
    const soundButtons = document.querySelectorAll('.sound-btn');

    soundButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sound = button.getAttribute('data-sound');
            playSound(sound);
        });
    });

    function playSound(sound) {
        const audio = new Audio(`sounds/${sound}.mp3`);
        audio.loop = true;
        audio.play();
    }
});
