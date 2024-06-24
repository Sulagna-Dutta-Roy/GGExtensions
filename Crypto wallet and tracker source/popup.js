document.getElementById('createWallet').addEventListener('click', async () => {
    const response = await fetch('http://localhost:3000/create-wallet', {
        method: 'POST'
    });
    const wallet = await response.json();
    document.getElementById('address').innerText = `Address: ${wallet.address}`;
    document.getElementById('balance').innerText = ''; // Clear balance on new wallet creation
});

document.getElementById('getBalance').addEventListener('click', async () => {
    const address = document.getElementById('address').innerText.split(': ')[1];
    if (address) {
        const response = await fetch(`http://localhost:3000/balance/${address}`);
        const balance = await response.json();
        document.getElementById('balance').innerText = `Balance: ${balance.balance} ETH`;
    }
});
