
document.addEventListener("DOMContentLoaded", function () {
    const matrixSizeSelect = document.getElementById('matrixSize');
    const matrixA = document.getElementById('matrixA');
    const eigenvaluesResult = document.getElementById('eigenvaluesResult');

    function createMatrixInputs(matrix, size) {
        matrix.innerHTML = '';
        for (let i = 0; i < size; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < size; j++) {
                const cell = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'number';
                input.id = `${matrix.id}${i}${j}`;
                cell.appendChild(input);
                row.appendChild(cell);
            }
            matrix.appendChild(row);
        }
    }

    function updateMatrixSize() {
        const size = parseInt(matrixSizeSelect.value);
        createMatrixInputs(matrixA, size);
    }

    matrixSizeSelect.addEventListener('change', updateMatrixSize);

    updateMatrixSize(); // Initial call to setup matrix

    document.getElementById('eigenvaluesBtn').addEventListener('click', calculateEigenvalues);

    function getMatrixValues(matrixId, size) {
        const values = [];
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                row.push(parseFloat(document.getElementById(`${matrixId}${i}${j}`).value) || 0);
            }
            values.push(row);
        }
        return values;
    }

    function calculateEigenvalues() {
        const size = parseInt(matrixSizeSelect.value);
        const matrix = getMatrixValues('matrixA', size);
        const eigen = math.eigs(matrix);
        const eigenvalues = eigen.values;

        eigenvaluesResult.textContent = eigenvalues.map(val => val.toFixed(2)).join(', ');
    }
});
