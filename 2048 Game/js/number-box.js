const keyLeft = 37;
const keyUp = 38;
const keyRight = 39;
const keyDown = 40;
let key = 0;
let moved = false;
let gridSize = 4;
let numberClasses = [
    "empty",
    "two",
    "four",
    "eight",
    "sixteen",
    "thirty-two",
    "sixty-four",
    "one-twenty-eight",
    "two-fifty-six",
    "five-twelve",
    "one-thousand-twenty-four",
    "two-thousand-forty-eight"
];
let numberBoxes = [];
let numberGrid = [];
let gridHistory = [];
$(document).keydown(function (e) {
    if (isGameOver()) {
        alert("Game Over!\nClick OK to Reset");
        prepareGrid(true);
    } else {
        key = e.which;
        moved = false;
        switch (key) {
            case keyLeft:
                moveLeft();
                break;
            case keyUp:
                moveUp();
                break;
            case keyRight:
                moveRight();
                break;
            case keyDown:
                moveDown();
                break;
            default:
                break;

        }
        if (moved) {
            putNewNumber();
        }
    }
    gridToBoxes();
    saveInLocalStorage();
});
document.getElementById("container-box").addEventListener('touchstart', handleTouchStart, {passive:false});
document.getElementById("container-box").addEventListener('touchmove', handleTouchMove, {passive:false});

var xDown = null;
var yDown = null;

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
};

function handleTouchMove(evt) {
	evt.preventDefault();
	moved = false;
    if (isGameOver()) {
        alert("Game Over!\nClick OK to Reset");
        prepareGrid(true);
    } else {
        if (!xDown || !yDown) {
            return;
        }

        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
            if (xDiff > 0) {
                moveLeft()
            } else {
                moveRight()
            }
        } else {
            if (yDiff > 0) {
                moveUp()
            } else {
                moveDown();
            }
        }
        /* reset values */
        xDown = null;
        yDown = null;

        if (moved) {
            putNewNumber();
        }
    }
    gridToBoxes();
    saveInLocalStorage();
}

$(document).ready(function () {
    prepareGrid(false);
    $("#btn-4").click(function () {
        if (confirm("This will reset the grid.\nAre you sure you want to reset the grid?")) {
            gridSize = 4;
            prepareGrid(true);
        }
    });
    $("#btn-5").click(function () {
        if (confirm("This will reset the grid.\nAre you sure you want to reset the grid?")) {
            gridSize = 5;
            prepareGrid(true);
        }
    });
    $("#btn-6").click(function () {
        if (confirm("This will reset the grid.\nAre you sure you want to reset the grid?")) {
            gridSize = 6;
            prepareGrid(true);
        }
    });
    $("#btn-7").click(function () {
        if (confirm("This will reset the grid.\nAre you sure you want to reset the grid?")) {
            gridSize = 7;
            prepareGrid(true);
        }
    });
    document.getElementById("undo-btn").addEventListener( "click", function () {
        historyUndo();
        gridToBoxes();
    });
});

function prepareGrid(forceReset) {
    numberBoxes = [];
    if (forceReset || !restoreFromLocalStorage()) {
		gridHistory = [];
        numberGrid = [];
        let fontSize = 0;
        switch (gridSize) {
            case 4:
                fontSize = 1.8;
                break;
            case 5:
                fontSize = 1.5;
                break;
            case 6:
                fontSize = 1.2;
                break;
            case 7:
                fontSize = 1;
                break;
            default:
                break;
        }

        let containerBox = $('#container-box');
        containerBox.css({"font-size": fontSize + "em"});
        containerBox.empty();
        let gridTemplate = "";
        for (let i = 0; i < gridSize; i++) {
            gridTemplate += "1fr ";
            let newNumberRow = [];
            numberGrid.push([]);
            for (let j = 0; j < gridSize; j++) {
                let newNumberBox = document.createElement("div");
                newNumberBox.classList.add("number-box");

                putInNumberBox(newNumberBox, 0);
                numberGrid[i].push(0);

                newNumberRow.push(newNumberBox);
                containerBox.append(newNumberBox);
            }
            numberBoxes.push(newNumberRow);
        }
        containerBox.css({
            "grid-template-columns": gridTemplate,
            "grid-template-rows": gridTemplate
        });
        putNewNumber();
        putNewNumber();
    } else {
        let fontSize = 0;
        switch (gridSize) {
            case 4:
                fontSize = 1.8;
                break;
            case 5:
                fontSize = 1.5;
                break;
            case 6:
                fontSize = 1.2;
                break;
            case 7:
                fontSize = 1;
                break;
            default:
                break;
        }

        let containerBox = $('#container-box');
        containerBox.css({"font-size": fontSize + "em"});
        containerBox.empty();
        let gridTemplate = "";
        for (let i = 0; i < gridSize; i++) {
            gridTemplate += "1fr ";
            let newNumberRow = [];
            for (let j = 0; j < gridSize; j++) {
                let newNumberBox = document.createElement("div");
                newNumberBox.classList.add("number-box");

                newNumberRow.push(newNumberBox);
                containerBox.append(newNumberBox);
            }
            numberBoxes.push(newNumberRow);
        }
        containerBox.css({
            "grid-template-columns": gridTemplate,
            "grid-template-rows": gridTemplate
        });
    }
    putActiveGridClass();
    gridToBoxes();
    saveInLocalStorage();
}

function generateRandomNumber() {
    if (Math.ceil(Math.random() * 10) >= 2) {
        return 2;
    } else {
        return 4;
    }
}

function putInNumberBox(numBox, num) {
    let prevValue = getVal(numBox);
    numBox.innerHTML = num ? num : "";
    numBox.classList.remove(prevValue ? numberClasses[Math.log2(prevValue)] : "empty");
    numBox.classList.add(num ? numberClasses[Math.log2(num)] : "empty");
}

function getVal(numBox) {
    return parseInt(numBox.innerHTML) ? parseInt(numBox.innerHTML) : 0;
}

function gridToBoxes() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            putInNumberBox(numberBoxes[i][j], numberGrid[i][j]);
        }
    }
}

function putNewNumber() {
    if (!isGridFull()) {
        let randomX = Math.floor(Math.random() * 4);
        let randomY = Math.floor(Math.random() * 4);
        while (numberGrid[randomX][randomY] !== 0) {
            randomX = Math.floor(Math.random() * 4);
            randomY = Math.floor(Math.random() * 4);
        }
        numberGrid[randomX][randomY] = generateRandomNumber();
        gridToBoxes();
    }
}

function transposeGrid() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j <= i; j++) {
            let temp = numberGrid[i][j];
            numberGrid[i][j] = numberGrid[j][i];
            numberGrid[j][i] = temp;
        }
    }
}

function isGridFull() {
    let gridFull = true;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (numberGrid[i][j] === 0) {
                gridFull = false;
            }
        }
    }
    return gridFull;
}

function isGameOver() {
    let gameOver = false;
    if (isGridFull()) {
        gameOver = true;
        for (let i = 1; i < gridSize - 1; i++) {
            for (let j = 1; j < gridSize - 1; j++) {
                if (numberGrid[i][j] === numberGrid[i][j - 1] ||
                    numberGrid[i][j] === numberGrid[i][j + 1] ||
                    numberGrid[i][j] === numberGrid[i - 1][j] ||
                    numberGrid[i][j] === numberGrid[i + 1][j]) {
                    gameOver = false;
                }
            }
        }
    }
    return gameOver;
}

function putActiveGridClass() {
    $("#btn-4").removeClass("active");
    $("#btn-5").removeClass("active");
    $("#btn-6").removeClass("active");
    $("#btn-7").removeClass("active");
    $("#btn-" + gridSize).addClass("active");
}

function historyAdd() {
    gridHistory.push(JSON.parse(JSON.stringify(numberGrid)));
}

function historyUndo() {
    if (gridHistory.length) {
        numberGrid = JSON.parse(JSON.stringify(gridHistory.pop()));
    }
}

function saveInLocalStorage() {
    window.localStorage.numberGrid = JSON.stringify(numberGrid);
	window.localStorage.gridHistory = JSON.stringify(gridHistory);
}

function restoreFromLocalStorage() {
    if (window.localStorage.numberGrid && window.localStorage.gridHistory) {
        console.log(window.localStorage.numberGrid);
		numberGrid = JSON.parse(window.localStorage.numberGrid);
		gridHistory = JSON.parse(window.localStorage.gridHistory);
		gridSize = numberGrid.length;
		return true;
    }
    return false;
}

function moveLeft() {
	historyAdd();
    for (let i = 0; i < gridSize; i++) {
        let merged = new Array(gridSize).fill(0);
        for (let j = 0; j < gridSize; j++) {
            if (numberGrid[i][j] !== 0) {
                let currJ = j;
                while (currJ > 0 && numberGrid[i][currJ - 1] === 0) {
                    currJ--;
                }
                if (j !== currJ) {
                    if (numberGrid[i][j] === numberGrid[i][currJ - 1] && merged[currJ - 1] !== 1) {
                        numberGrid[i][currJ - 1] *= 2;
                        numberGrid[i][j] = 0;
                        merged[currJ - 1] = 1;
                    } else {
                        numberGrid[i][currJ] = numberGrid[i][j];
                        numberGrid[i][j] = 0;
                    }
                    moved = true;
                } else if (numberGrid[i][j] === numberGrid[i][j - 1] && merged[currJ - 1] !== 1) {
                    numberGrid[i][j - 1] *= 2;
                    numberGrid[i][j] = 0;
                    merged[j - 1] = 1;
                    moved = true;
                }
            }
        }
    }
	if (!moved) {
		historyUndo();
	}
}

function moveUp() {
	historyAdd();
	transposeGrid();
	for (let i = 0; i < gridSize; i++) {
        let merged = new Array(gridSize).fill(0);
        for (let j = 0; j < gridSize; j++) {
            if (numberGrid[i][j] !== 0) {
                let currJ = j;
                while (currJ > 0 && numberGrid[i][currJ - 1] === 0) {
                    currJ--;
                }
                if (j !== currJ) {
                    if (numberGrid[i][j] === numberGrid[i][currJ - 1] && merged[currJ - 1] !== 1) {
                        numberGrid[i][currJ - 1] *= 2;
                        numberGrid[i][j] = 0;
                        merged[currJ - 1] = 1;
                    } else {
                        numberGrid[i][currJ] = numberGrid[i][j];
                        numberGrid[i][j] = 0;
                    }
                    moved = true;
                } else if (numberGrid[i][j] === numberGrid[i][j - 1] && merged[currJ - 1] !== 1) {
                    numberGrid[i][j - 1] *= 2;
                    numberGrid[i][j] = 0;
                    merged[j - 1] = 1;
                    moved = true;
                }
            }
        }
    }
	transposeGrid();
	if (!moved) {
		historyUndo();
	}
}

function moveRight() {
	historyAdd();
    for (let i = gridSize - 1; i >= 0; i--) {
        let merged = new Array(gridSize).fill(0);
        for (let j = gridSize - 1; j >= 0; j--) {
            if (numberGrid[i][j] !== 0) {
                let currJ = j;
                while (currJ < gridSize - 1 && numberGrid[i][currJ + 1] === 0) {
                    currJ++;
                }
                if (j !== currJ) {
                    if (numberGrid[i][j] === numberGrid[i][currJ + 1] && merged[currJ + 1] !== 1) {
                        numberGrid[i][currJ + 1] *= 2;
                        numberGrid[i][j] = 0;
                        merged[currJ + 1] = 1;
                    } else {
                        numberGrid[i][currJ] = numberGrid[i][j];
                        numberGrid[i][j] = 0;
                    }
                    moved = true;
                } else if (numberGrid[i][j] === numberGrid[i][j + 1] && merged[currJ + 1] !== 1) {
                    numberGrid[i][j + 1] *= 2;
                    numberGrid[i][j] = 0;
                    merged[j + 1] = 1;
                    moved = true;
                }
            }
        }
    }
	if (!moved) {
		historyUndo();
	}
}

function moveDown() {
	historyAdd();
	transposeGrid();
	for (let i = gridSize - 1; i >= 0; i--) {
        let merged = new Array(gridSize).fill(0);
        for (let j = gridSize - 1; j >= 0; j--) {
            if (numberGrid[i][j] !== 0) {
                let currJ = j;
                while (currJ < gridSize - 1 && numberGrid[i][currJ + 1] === 0) {
                    currJ++;
                }
                if (j !== currJ) {
                    if (numberGrid[i][j] === numberGrid[i][currJ + 1] && merged[currJ + 1] !== 1) {
                        numberGrid[i][currJ + 1] *= 2;
                        numberGrid[i][j] = 0;
                        merged[currJ + 1] = 1;
                    } else {
                        numberGrid[i][currJ] = numberGrid[i][j];
                        numberGrid[i][j] = 0;
                    }
                    moved = true;
                } else if (numberGrid[i][j] === numberGrid[i][j + 1] && merged[currJ + 1] !== 1) {
                    numberGrid[i][j + 1] *= 2;
                    numberGrid[i][j] = 0;
                    merged[j + 1] = 1;
                    moved = true;
                }
            }
        }
    }
	transposeGrid();
	if (!moved) {
		historyUndo();
	}
}