const runningElem = document.querySelector('#running');
const gamepadsElem = document.querySelector('#gamepads');
const vibrationButton = document.getElementById('vibrationButton');
const vibrationIntensitySlider = document.getElementById('vibrationIntensitySlider');
let isTimerRunning = false;
const gamepadsByIndex = {};

function addGamepad(gamepad) {
    const div = document.createElement('div');
    div.classList.add('gamepad');
    div.innerHTML = `
        <div class="head">
            <div class="index">${gamepad.index}</div>
            <div class="id">${gamepad.id}</div>
        </div>
        <div class="info">
            <div class="label">Connected:</div>
            <span class="connected">${gamepad.connected}</span>
        </div>
        <div class="info">
            <div class="label">Mapping:</div>
            <span class="mapping">${gamepad.mapping}</span>
        </div>
        <div class="inputs">
            <p><b>Analog Sticks</b></p>
            <div class="axes"></div>
            <p><b>Buttons</b></p>
            <div class="buttons"></div>
        </div>
    `;

    const axesElem = div.querySelector('.axes');
    gamepad.axes.forEach((_, i) => {
        const axisDiv = document.createElement('div');
        axisDiv.classList.add('axis');
        axisDiv.innerHTML = `<div class="indicator"></div>`;
        axesElem.appendChild(axisDiv);
    });

    const buttonsElem = div.querySelector('.buttons');
    gamepad.buttons.forEach((_, i) => {
        const buttonDiv = document.createElement('div');
        buttonDiv.classList.add('button');
        buttonDiv.innerHTML = `<span>${i}</span>`;
        buttonsElem.appendChild(buttonDiv);
    });

    gamepadsByIndex[gamepad.index] = {
        gamepad,
        div,
        axes: axesElem.querySelectorAll('.axis .indicator'),
        buttons: buttonsElem.querySelectorAll('.button')
    };
    
    gamepadsElem.appendChild(div);
}

function updateGamepads() {
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
            const gamepad = gamepads[i];
            const info = gamepadsByIndex[gamepad.index];
            if (info) {
                updateGamepad(info, gamepad);
            } else {
                addGamepad(gamepad);
            }
        }
    }
}

function updateGamepad(info, gamepad) {
    const {axes, buttons} = info;

    gamepad.axes.forEach((value, i) => {
        const axis = axes[i];
        const x = value * 50; // scale value to fit the axis element
        axis.style.transform = `translate(${x}px, ${x}px)`;
    });

    gamepad.buttons.forEach((button, i) => {
        const btn = buttons[i];
        btn.classList.toggle('pressed', button.pressed);
        btn.querySelector('span').textContent = button.value.toFixed(2);
    });
}

function startTimer() {
    isTimerRunning = true;
    function update() {
        if (!isTimerRunning) return;
        runningElem.textContent = ((performance.now() * 0.01 * 60).toFixed(2)).toString().padStart(2, '0');
        updateGamepads();
        requestAnimationFrame(update);
    }
    update();
}

function stopTimer() {
    isTimerRunning = false;
}

function testVibration() {
    const gamepads = navigator.getGamepads();
    for (let gamepad of gamepads) {
        if (gamepad && gamepad.vibrationActuator) {
            gamepad.vibrationActuator.playEffect("dual-rumble", {
                duration: 4000,
                strongMagnitude: vibrationIntensitySlider.value,
                weakMagnitude: vibrationIntensitySlider.value
            });
        }
    }
}

window.addEventListener('gamepadconnected', (e) => {
    addGamepad(e.gamepad);
    if (!isTimerRunning) startTimer();
});

window.addEventListener('gamepaddisconnected', (e) => {
    delete gamepadsByIndex[e.gamepad.index];
    gamepadsElem.removeChild(gamepadsElem.querySelector(`.gamepad[data-index="${e.gamepad.index}"]`));
    if (Object.keys(gamepadsByIndex).length === 0) stopTimer();
});

vibrationButton.addEventListener('click', testVibration);

startTimer();

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const resetButton = document.getElementById("resetButton");

startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
resetButton.addEventListener("click", resetTimer);

function resetTimer() {
  runningElem.textContent = "00.00";
}


