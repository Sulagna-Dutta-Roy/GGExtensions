function calculateROI() {
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value);
    const finalValue = parseFloat(document.getElementById('finalValue').value);
    const investmentPeriod = parseFloat(document.getElementById('investmentPeriod').value);

    if (isNaN(initialInvestment) || isNaN(finalValue) || isNaN(investmentPeriod) || initialInvestment <= 0 || investmentPeriod <= 0) {
        document.getElementById('result').textContent = 'Please enter valid values.';
        return;
    }

    const roi = ((finalValue - initialInvestment) / initialInvestment) * 100;
    const annualizedROI = (Math.pow((finalValue / initialInvestment), (1 / investmentPeriod)) - 1) * 100;

    document.getElementById('result').innerHTML = `
        <p>Total ROI: ${roi.toFixed(2)}%</p>
        <p>Annualized ROI: ${annualizedROI.toFixed(2)}%</p>
    `;
}
