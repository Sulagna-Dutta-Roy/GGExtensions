document.addEventListener('DOMContentLoaded', () => {
    const targetSequenceElement = document.getElementById('target-sequence');
    const randomSequenceElement = document.getElementById('random-sequence');
    const shuffleButton = document.getElementById('shuffle-button');
    const timerElement = document.getElementById('time');
    const messageElement = document.getElementById('message');

    const targetSequence = ['A', 'T', 'C', 'G'];
    let randomSequence = [...targetSequence];
    let timer = 60;
    let interval;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createSequenceElement(sequence, parentElement) {
        parentElement.innerHTML = '';
        sequence.forEach(base => {
            const baseElement = document.createElement('div');
            baseElement.textContent = base;
            baseElement.classList.add('dna-base');
            baseElement.draggable = true;
            baseElement.addEventListener('dragstart', handleDragStart);
            baseElement.addEventListener('dragover', handleDragOver);
            baseElement.addEventListener('drop', handleDrop);
            parentElement.appendChild(baseElement);
        });
    }

    function handleDragStart(event) {
        event.dataTransfer.setData('text', event.target.textContent);
        event.target.classList.add('dragging');
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        const draggedBase = document.querySelector('.dragging');
        const droppedBase = event.target;

        if (draggedBase && droppedBase) {
            const draggedIndex = Array.from(draggedBase.parentNode.children).indexOf(draggedBase);
            const droppedIndex = Array.from(droppedBase.parentNode.children).indexOf(droppedBase);

            [randomSequence[draggedIndex], randomSequence[droppedIndex]] = [randomSequence[droppedIndex], randomSequence[draggedIndex]];

            createSequenceElement(randomSequence, randomSequenceElement);
            draggedBase.classList.remove('dragging');
            checkWin();
        }
    }

    function checkWin() {
        if (JSON.stringify(randomSequence) === JSON.stringify(targetSequence)) {
            clearInterval(interval);
            messageElement.textContent = 'You win!';
        }
    }

    function startTimer() {
        interval = setInterval(() => {
            timer--;
            timerElement.textContent = timer;
            if (timer === 0) {
                clearInterval(interval);
                messageElement.textContent = 'Time\'s up! You lose.';
            }
        }, 1000);
    }

    shuffleButton.addEventListener('click', () => {
        randomSequence = shuffle([...targetSequence]);
        createSequenceElement(randomSequence, randomSequenceElement);
    });

    createSequenceElement(targetSequence, targetSequenceElement);
    createSequenceElement(randomSequence, randomSequenceElement);
    startTimer();
});