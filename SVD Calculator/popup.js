document.addEventListener('DOMContentLoaded', function() {
  const matrixSizeSelect = document.getElementById('matrix-size');
  const matrixForm = document.getElementById('matrix-form');
  const matrixInputs = document.getElementById('matrix-inputs');
  const output = document.getElementById('output');

  function generateMatrixInputs(rows, cols) {
    matrixInputs.innerHTML = '';
    matrixInputs.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `cell-${i}-${j}`;
        input.value = 0;
        matrixInputs.appendChild(input);
      }
    }
  }

  matrixSizeSelect.addEventListener('change', function() {
    const value = parseInt(matrixSizeSelect.value);
    let rows, cols;

    switch(value) {
      case 1:
        rows = cols = 1;
        break;
      case 2:
        rows = cols = 2;
        break;
      case 3:
        rows = cols = 3;
        break;
      case 4:
        rows = cols = 4;
        break;
      case 5:
        rows = 1; cols = 2;
        break;
      case 6:
        rows = 1; cols = 3;
        break;
      case 7:
        rows = 1; cols = 4;
        break;
      case 8:
        rows = 2; cols = 1;
        break;
      case 9:
        rows = 2; cols = 3;
        break;
      case 10:
        rows = 2; cols = 4;
        break;
      case 11:
        rows = 3; cols = 1;
        break;
      case 12:
        rows = 3; cols = 2;
        break;
      case 13:
        rows = 3; cols = 4;
        break;
      case 14:
        rows = 4; cols = 1;
        break;
      case 15:
        rows = 4; cols = 2;
        break;
      case 16:
        rows = 4; cols = 3;
        break;
    }

    generateMatrixInputs(rows, cols);
  });

  matrixForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const value = parseInt(matrixSizeSelect.value);
    let rows, cols;

    switch(value) {
      case 1:
        rows = cols = 1;
        break;
      case 2:
        rows = cols = 2;
        break;
      case 3:
        rows = cols = 3;
        break;
      case 4:
        rows = cols = 4;
        break;
      case 5:
        rows = 1; cols = 2;
        break;
      case 6:
        rows = 1; cols = 3;
        break;
      case 7:
        rows = 1; cols = 4;
        break;
      case 8:
        rows = 2; cols = 1;
        break;
      case 9:
        rows = 2; cols = 3;
        break;
      case 10:
        rows = 2; cols = 4;
        break;
      case 11:
        rows = 3; cols = 1;
        break;
      case 12:
        rows = 3; cols = 2;
        break;
      case 13:
        rows = 3; cols = 4;
        break;
      case 14:
        rows = 4; cols = 1;
        break;
      case 15:
        rows = 4; cols = 2;
        break;
      case 16:
        rows = 4; cols = 3;
        break;
    }

    // Collect the matrix values
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push(parseFloat(document.getElementById(`cell-${i}-${j}`).value));
      }
      matrix.push(row);
    }

    // Calculate SVD using the svd.js library

    const {u,q,v} = SVDJS.SVD(matrix);
    const n = q.length;
    function createDiagonalMatrix(array) {
      const size = array.length;
      const matrix = [];
      for (let i = 0; i < size; i++) {
        const row = new Array(size).fill(0.00);
        row[i] = parseFloat(array[i].toFixed(2));
        matrix.push(row);
      }
      return matrix;
    }

    const matrixS = createDiagonalMatrix(q);

    // Function to format matrix as a string
    function formatMatrix(matrix) {
      return matrix.map(row => row.join('\t')).join('\n');
    }
    function roundMatrix(matrix, decimals) {
      // Iterate through each element of the matrix
      for (let i = 0; i < matrix.length; i++) {
          for (let j = 0; j < matrix[i].length; j++) {
              // Round each element to the specified number of decimals
              m=matrix[i][j];
              console.log(m)
              matrix[i][j] = parseFloat(m.toFixed(decimals));
          }
      }
      return matrix;
  }
    // Display the results
    output.textContent = `U:\n${formatMatrix(roundMatrix(u, 2))}\n\nS:\n${formatMatrix(roundMatrix(matrixS, 2))}\n\nV:\n${formatMatrix(roundMatrix(v, 2))}`;
  });

  // Initialize the default matrix size
  generateMatrixInputs(1, 1);
});
