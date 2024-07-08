document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const unitName = document.getElementById('unitName');
    const unitHealth = document.getElementById('unitHealth');
    const attackButton = document.getElementById('attackButton');

    let selectedUnit = null;

    const units = [
        { id: 1, name: 'Knight', health: 100, position: { x: 0, y: 0 } },
        { id: 2, name: 'Orc', health: 80, position: { x: 4, y: 4 } }
    ];

    function createBoard() {
        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            gameBoard.appendChild(cell);
        }
    }

    function renderUnits() {
        units.forEach(unit => {
            const index = unit.position.y * 5 + unit.position.x;
            const cell = document.querySelector(`.cell[data-index='${index}']`);
            cell.classList.add('unit');
            cell.dataset.unitId = unit.id;
        });
    }

    function selectUnit(unit) {
        selectedUnit = unit;
        unitName.textContent = `Name: ${unit.name}`;
        unitHealth.textContent = `Health: ${unit.health}`;
    }

    gameBoard.addEventListener('click', (event) => {
        const cell = event.target;
        if (cell.classList.contains('unit')) {
            const unitId = cell.dataset.unitId;
            const unit = units.find(u => u.id == unitId);
            selectUnit(unit);
        }
    });

    attackButton.addEventListener('click', () => {
        if (selectedUnit) {
            selectedUnit.health -= 10;
            unitHealth.textContent = `Health: ${selectedUnit.health}`;
        }
    });

    createBoard();
    renderUnits();
});
