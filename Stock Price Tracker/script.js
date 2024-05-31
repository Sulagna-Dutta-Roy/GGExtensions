document.getElementById('stock-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const stockSymbol = document.getElementById('stock-symbol').value;
    getStockPrice(stockSymbol);
});

function getStockPrice(symbol) {
    const apiKey = 'YOUR_API_KEY'; // Replace 'YOUR_API_KEY' with your Alpha Vantage API key
    const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        if (data['Global Quote']) {
            const price = data['Global Quote']['05. price'];
            updateStockPrice(symbol, price);
        } else {
            alert('Invalid stock symbol. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error fetching stock price:', error);
        alert('Error fetching stock price. Please try again later.');
    });
}

function updateStockPrice(symbol, price) {
    document.getElementById('stock-price').innerText = `${symbol}: $${price}`;
}
