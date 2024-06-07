// script.js
document.addEventListener('DOMContentLoaded', () => {
    const homePage = document.getElementById('home-page');
    const gamePage = document.getElementById('game-page');
    const congratsPage = document.getElementById('congrats-page');
    const userBoard = document.getElementById('user-board');
    const computerBoard = document.getElementById('computer-board');
    const startButton = document.getElementById('start-button');
    const homeButton = document.getElementById('home-button');
    const restartButton = document.getElementById('restart-button');
    const turnIndicator = document.getElementById('turn-indicator');
    const congratsMessage = document.getElementById('congrats-message');
    let userNumbers = [];
    let computerNumbers = [];
    let selectedNumbers = [];
    let userTurn = true;
    const numPlayers = 2;
    const userIndex = 0;
    const computerIndex = 1;
    let data = [
        Array(12).fill(false), // User win states
        Array(12).fill(false)  // Computer win states
    ];
    document.getElementById('about-button').addEventListener('click', function() {
        window.location.href = 'aboutus.html'; // Replace 'about.html' with the actual path to your About Us page
    });
    
    const winningPositions = [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20]
    ];

    function switchPage(toShow) {
        homePage.classList.add('hidden');
        gamePage.classList.add('hidden');
        congratsPage.classList.add('hidden');
        toShow.classList.remove('hidden');
    }

    function generateUserBoard(board, numbers) {
        board.innerHTML = '';
        numbers.forEach(number => {
            const cell = document.createElement('div');
            cell.textContent = number;
            cell.addEventListener('click', () => {
                if (userTurn && !cell.classList.contains('clicked')) {
                    markNumber(userBoard, number);
                    markNumber(computerBoard, number);
                    userTurn = false;
                    turnIndicator.textContent = "Computer's Turn";
                    setTimeout(playComputerTurn, 1000);
                }
            });
            board.appendChild(cell);
        });
    }
    function generateComputerBoard(board, numbers) {
        board.innerHTML = '';
        numbers.forEach(number => {
            const cell = document.createElement('div');
            cell.textContent = '?';
            cell.addEventListener('click', () => {
                if (userTurn && !cell.classList.contains('clicked')) {
                    markNumber(userBoard, number);
                    markNumber(computerBoard, number);
                    userTurn = false;
                    turnIndicator.textContent = "Computer's Turn";
                    setTimeout(playComputerTurn, 1000);
                }
            });
            board.appendChild(cell);
        });
    }

    function generateNumbers() {
        let numbers = [];
        for (let i = 1; i <= 25; i++) {
            numbers.push(i);
        }
        return shuffle(numbers);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function checkWinningConditions() {
        const boards = [userBoard, computerBoard];
        for (let k = 0; k < numPlayers; k++) {
            const cells = boards[k].querySelectorAll('div');
            checkMatchWin(cells, k, winningPositions);
        }

        const userWins = data[userIndex].filter(Boolean).length >= 5;
        const computerWins = data[computerIndex].filter(Boolean).length >= 5;

        if (userWins && computerWins) {
            handleWin('draw');
        } else if (userWins) {
            handleWin('user');
        } else if (computerWins) {
            handleWin('computer');
        }
    }

    function checkDrawCondition() {
        const userCount = data[userIndex].filter(Boolean).length;
        const computerCount = data[computerIndex].filter(Boolean).length;
        return userCount >= 5 && computerCount >= 5 && userCount === computerCount;
    }

    function checkMatchWin(cells, playerIndex, winningPositions) {
        for (let i = 0; i < 12; i++) {
            if (!data[playerIndex][i]) {
                let flag = true;
                for (let j = 0; j < 5; j++) {
                    if (!cells[winningPositions[i][j]].classList.contains('clicked')) {
                        flag = false;
                        break;
                    }
                }
                data[playerIndex][i] = flag;
            }
        }
    }

    function handleWin(winner) {
        if (winner === 'user') {
            congratsMessage.textContent = 'Congratulations! You won!';
        } else if (winner === 'computer') {
            congratsMessage.textContent = 'Sorry, the computer won!';
        } else {
            congratsMessage.textContent = "It's a draw!";
        }
        switchPage(congratsPage);
    }

    startButton.addEventListener('click', () => {
        userNumbers = generateNumbers();
        computerNumbers = generateNumbers();
        selectedNumbers = [];
        userTurn = true;
        data = [Array(12).fill(false), Array(12).fill(false)];
        turnIndicator.textContent = "User's Turn";
        generateUserBoard(userBoard, userNumbers);
        generateComputerBoard(computerBoard, computerNumbers);
        switchPage(gamePage);
    });

    homeButton.addEventListener('click', () => switchPage(homePage));
    restartButton.addEventListener('click', () => switchPage(homePage));

    function playComputerTurn() {
        if (!userTurn) {
            let num;
            do {
                num = Math.floor(Math.random() * 25) + 1;
            } while (selectedNumbers.includes(num));
            selectedNumbers.push(num);
            markNumber(userBoard, num);
            markNumber(computerBoard, num);
    
            if (!checkWinningConditions()) {
                userTurn = true;
                turnIndicator.textContent = "User's Turn";
            }
        }
    }
    

    function markNumber(board, number) {
        const cells = board.querySelectorAll('div');
        cells.forEach(cell => {
            if (parseInt(cell.textContent) === number) {
                cell.classList.add('clicked');
            }
        });
        checkWinningConditions();
    }
});