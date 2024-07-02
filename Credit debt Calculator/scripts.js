document.addEventListener('DOMContentLoaded', () => {
    const cards = JSON.parse(localStorage.getItem('cards')) || [];

    const renderCards = () => {
        const cardList = document.getElementById('cardList');
        cardList.innerHTML = '';
        cards.forEach((card, index) => {
            const cardItem = document.createElement('div');
            cardItem.className = 'card-item';
            cardItem.innerHTML = `
                <span>${card.cardName} - $${card.totalDebt.toFixed(2)} - ${card.interestRate}%</span>
                <button onclick="removeCard(${index})">Remove</button>
            `;
            cardList.appendChild(cardItem);
        });
    };

    const saveCards = () => {
        localStorage.setItem('cards', JSON.stringify(cards));
        renderCards();
    };

    document.getElementById('addCard').addEventListener('click', () => {
        const cardName = document.getElementById('cardName').value;
        const totalDebt = parseFloat(document.getElementById('totalDebt').value);
        const interestRate = parseFloat(document.getElementById('interestRate').value);
        const minPayment = parseFloat(document.getElementById('minPayment').value);

        if (cardName && totalDebt && interestRate && minPayment) {
            cards.push({ cardName, totalDebt, interestRate, minPayment, balance: totalDebt });
            document.getElementById('debtForm').reset();
            alert(`${cardName} added successfully!`);
            saveCards();
        } else {
            alert('Please fill in all fields.');
        }
    });

    document.getElementById('calculate').addEventListener('click', () => {
        const additionalPayment = parseFloat(document.getElementById('additionalPayment').value);
        const paymentStrategy = document.getElementById('paymentStrategy').value;

        if (additionalPayment && cards.length > 0) {
            const result = calculatePaymentPlan(cards, additionalPayment, paymentStrategy);
            displayResult(result);
        } else {
            alert('Please add credit card details and specify the additional payment.');
        }
    });

    function calculatePaymentPlan(cards, additionalPayment, method) {
        const sortedCards = [...cards];
        if (method === 'avalanche') {
            sortedCards.sort((a, b) => b.interestRate - a.interestRate);
        } else if (method === 'snowball') {
            sortedCards.sort((a, b) => a.balance - b.balance);
        }

        let totalPayments = 0;
        let totalInterest = 0;
        let month = 0;

        while (sortedCards.some(card => card.balance > 0)) {
            month++;
            let monthlyPayment = additionalPayment;

            sortedCards.forEach(card => {
                if (card.balance > 0) {
                    const interest = card.balance * (card.interestRate / 100 / 12);
                    let payment = card.minPayment + Math.min(monthlyPayment, card.balance);

                    if (payment > card.balance + interest) {
                        payment = card.balance + interest;
                    }

                    card.balance += interest - payment;
                    totalInterest += interest;
                    totalPayments += payment;
                    monthlyPayment -= (payment - card.minPayment);

                    if (monthlyPayment < 0) {
                        return;
                    }
                }
            });
        }

        return { totalPayments, totalInterest, month };
    }

    function displayResult({ totalPayments, totalInterest, month }) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <h2>Payment Plan Results</h2>
            <p>Total Payments: $${totalPayments.toFixed(2)}</p>
            <p>Total Interest Paid: $${totalInterest.toFixed(2)}</p>
            <p>Months to Pay Off: ${month}</p>
        `;
    }

    window.removeCard = (index) => {
        cards.splice(index, 1);
        saveCards();
    };

    renderCards();
});
