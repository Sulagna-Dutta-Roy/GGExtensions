document.addEventListener('DOMContentLoaded', function() {
    const puzzle = document.getElementById('puzzle');
    const moveCounter = document.getElementById('moveCounter');
    const timerElement = document.getElementById('timer');
    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');
    
    let emptyIndex = 15;
    let pieces = Array.from({length: 16}, (_, i) => i + 1);
    pieces[15] = '';
    let moves = 0;
    let timer;
    let seconds = 0;
    let gameStarted = false;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createPuzzle() {
        puzzle.innerHTML = '';
        pieces.forEach((num, index) => {
            const piece = document.createElement('div');
            piece.className = 'piece' + (num === '' ? ' empty' : '');
            piece.textContent = num;
            piece.dataset.index = index;
            puzzle.appendChild(piece);
        });
    }

    function canMove(targetIndex) {
        const [targetRow, targetCol] = [Math.floor(targetIndex / 4), targetIndex % 4];
        const [emptyRow, emptyCol] = [Math.floor(emptyIndex / 4), emptyIndex % 4];
        return Math.abs(targetRow - emptyRow) + Math.abs(targetCol - emptyCol) === 1;
    }

    function startTimer() {
        timer = setInterval(() => {
            seconds++;
            timerElement.textContent = seconds;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    function resetGame() {
        stopTimer();
        moves = 0;
        seconds = 0;
        moveCounter.textContent = moves;
        timerElement.textContent = seconds;
        shuffle(pieces);
        emptyIndex = pieces.indexOf('');
        createPuzzle();
        gameStarted = false;
    }

    puzzle.addEventListener('click', function(e) {
        if (!gameStarted) return;
        const target = e.target;
        const targetIndex = parseInt(target.dataset.index, 10);
        if (target.classList.contains('empty') || !canMove(targetIndex)) return;

        pieces[emptyIndex] = pieces[targetIndex];
        pieces[targetIndex] = '';
        emptyIndex = targetIndex;
        moves++;
        moveCounter.textContent = moves;
        createPuzzle();
    });

    startButton.addEventListener('click', function() {
        if (gameStarted) return;
        gameStarted = true;
        startTimer();
    });

    resetButton.addEventListener('click', resetGame);

    // Initial puzzle setup
    resetGame();
});
