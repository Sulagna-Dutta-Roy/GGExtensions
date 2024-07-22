function addCustomSpeedControl() {
    const controls = document.querySelector('.ytp-right-controls');
    if (controls && !document.getElementById('custom-speed-input')) {
        const input = document.createElement('input');
        input.type = 'number';
        input.step = '0.1';
        input.min = '0.1';
        input.max = '10';
        input.value = '1';
        input.id = 'custom-speed-input';
        input.style.width = '50px';
        input.style.marginRight = '10px';
        input.title = 'Custom Speed';

        input.addEventListener('change', () => {
            const video = document.querySelector('video');
            if (video) {
                video.playbackRate = parseFloat(input.value);
            }
        });

        controls.insertBefore(input, controls.firstChild);
    }
}

function init() {
    const observer = new MutationObserver(addCustomSpeedControl);
    observer.observe(document.body, { childList: true, subtree: true });
    addCustomSpeedControl();
}

document.addEventListener('DOMContentLoaded', init);
