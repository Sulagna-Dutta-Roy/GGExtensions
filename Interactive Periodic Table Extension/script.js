document.addEventListener('DOMContentLoaded', () => {
    const searchButtonForName = document.getElementById('search-button-for-name');
    const searchButtonForSymbol = document.getElementById('search-button-for-symbol');
    const elementNameInput = document.getElementById('element-name');
    const inputSymbol = document.getElementById('input-symbol');
    const periodicTable = document.getElementById('periodic-table');
    const elementDetails = document.getElementById('element-details');
    const elementNameDisplay = document.getElementById('element-name-display');
    const elementSymbol = document.getElementById('element-symbol');
    const elementAtomicNumber = document.getElementById('element-atomic-number');
    const elementCategory = document.getElementById('element-category');
    const elementUses = document.getElementById('element-uses');
    const elementHistory = document.getElementById('element-history');
    const closeDetailsButton = document.getElementById('close-details');

    searchButtonForName.addEventListener('click', () => {
        const query = elementNameInput.value.trim().toLowerCase();
        const element = elements.find(el => el.name.toLowerCase() === query);

        if (element) {
            showElementDetailsByInput(element);
        } else {
            alert('Element not found');
        }
    });

    searchButtonForSymbol.addEventListener('click', () => {
        const query = inputSymbol.value.trim();
        const element = elements.find(el => el.symbol === query);

        if (element) {
            showElementDetailsByInput(element);
        } else {
            alert('Element not found');
        }
    });

    // show element details by input

    function showElementDetailsByInput(element) {
        elementNameDisplay.textContent = element.name;
        elementSymbol.textContent = element.symbol;
        elementAtomicNumber.textContent = element.atomicNumber;
        elementCategory.textContent = element.category;
        elementUses.textContent = element.uses;
        elementHistory.textContent = element.history;
        elementDetails.classList.remove('hidden');
    }

    elements.forEach((element, index) => {
        const elementDiv = document.createElement('div');
        elementDiv.className = 'element';
        elementDiv.textContent = element.symbol;
        elementDiv.addEventListener('click', () => showElementDetails(index));
        periodicTable.appendChild(elementDiv);
    });

    function showElementDetails(index) {
        const element = elements[index];
        elementNameDisplay.textContent = element.name;
        elementSymbol.textContent = element.symbol;
        elementAtomicNumber.textContent = element.atomicNumber;
        elementCategory.textContent = element.category;
        elementUses.textContent = element.uses;
        elementHistory.textContent = element.history;
        elementDetails.classList.remove('hidden');
    }

    closeDetailsButton.addEventListener('click', () => {
        elementDetails.classList.add('hidden');
    });
});
