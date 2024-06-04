// popup.js

document.getElementById('addBtn').addEventListener('click', addMatrices);
document.getElementById('subtractBtn').addEventListener('click', subtractMatrices);
document.getElementById('multiplyBtn').addEventListener('click', multiplyMatrices);
document.getElementById('determinantABtn').addEventListener('click', () => determinantMatrix('a'));
document.getElementById('determinantBBtn').addEventListener('click', () => determinantMatrix('b'));
document.getElementById('transposeABtn').addEventListener('click', () => transposeMatrix('a'));
document.getElementById('transposeBBtn').addEventListener('click', () => transposeMatrix('b'));

function getMatrixValues(matrixId) {
    const matrix = [];
    for (let i = 0; i < 3; i++) {
        const row = [];
        for (let j = 0; j < 3; j++) {
            const value = parseFloat(document.getElementById(`${matrixId}${i}${j}`).value) || 0;
            row.push(value);
        }
        matrix.push(row);
    }
    return matrix;
}

function setMatrixValues(matrixId, values) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            document.getElementById(`${matrixId}${i}${j}`).innerText = values[i][j];
        }
    }
}

function addMatrices() {
    const A = getMatrixValues('a');
    const B = getMatrixValues('b');
    const result = A.map((row, i) => row.map((val, j) => val + B[i][j]));
    setMatrixValues('r', result);
}

function subtractMatrices() {
    const A = getMatrixValues('a');
    const B = getMatrixValues('b');
    const result = A.map((row, i) => row.map((val, j) => val - B[i][j]));
    setMatrixValues('r', result);
}

function multiplyMatrices() {
    const A = getMatrixValues('a');
    const B = getMatrixValues('b');
    const result = [
        [
            A[0][0] * B[0][0] + A[0][1] * B[1][0] + A[0][2] * B[2][0],
            A[0][0] * B[0][1] + A[0][1] * B[1][1] + A[0][2] * B[2][1],
            A[0][0] * B[0][2] + A[0][1] * B[1][2] + A[0][2] * B[2][2]
        ],
        [
            A[1][0] * B[0][0] + A[1][1] * B[1][0] + A[1][2] * B[2][0],
            A[1][0] * B[0][1] + A[1][1] * B[1][1] + A[1][2] * B[2][1],
            A[1][0] * B[0][2] + A[1][1] * B[1][2] + A[1][2] * B[2][2]
        ],
        [
            A[2][0] * B[0][0] + A[2][1] * B[1][0] + A[2][2] * B[2][0],
            A[2][0] * B[0][1] + A[2][1] * B[1][1] + A[2][2] * B[2][1],
            A[2][0] * B[0][2] + A[2][1] * B[1][2] + A[2][2] * B[2][2]
        ]
    ];
    setMatrixValues('r', result);
}

function determinantMatrix(matrixId) {
    const A = getMatrixValues(matrixId);
    const det = 
        A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
        A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
        A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
    alert(`Determinant of Matrix ${matrixId.toUpperCase()}: ${det}`);
}

function transposeMatrix(matrixId) {
    const A = getMatrixValues(matrixId);
    const result = [
        [A[0][0], A[1][0], A[2][0]],
        [A[0][1], A[1][1], A[2][1]],
        [A[0][2], A[1][2], A[2][2]]
    ];
    setMatrixValues('r', result);
}
