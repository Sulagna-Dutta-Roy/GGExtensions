let income = 0;
let expenses = 0;
let savings = 0;
let investments = 0;

function addIncome() {
    const incomeInput = document.getElementById('incomeInput').value;
    if (incomeInput) {
        income += parseFloat(incomeInput);
        document.getElementById('income').innerText = `$${income.toFixed(2)}`;
        document.getElementById('incomeInput').value = '';
    }
}

function addExpense() {
    const expensesInput = document.getElementById('expensesInput').value;
    if (expensesInput) {
        expenses += parseFloat(expensesInput);
        document.getElementById('expenses').innerText = `$${expenses.toFixed(2)}`;
        document.getElementById('expensesInput').value = '';
    }
}

function addSavings() {
    const savingsInput = document.getElementById('savingsInput').value;
    if (savingsInput) {
        savings += parseFloat(savingsInput);
        document.getElementById('savings').innerText = `$${savings.toFixed(2)}`;
        document.getElementById('savingsInput').value = '';
    }
}

function addInvestment() {
    const investmentsInput = document.getElementById('investmentsInput').value;
    if (investmentsInput) {
        investments += parseFloat(investmentsInput);
        document.getElementById('investments').innerText = `$${investments.toFixed(2)}`;
        document.getElementById('investmentsInput').value = '';
    }
}
