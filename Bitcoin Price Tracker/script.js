document.addEventListener("DOMContentLoaded", function() {
    const currencies = ["bitcoin", "ethereum","litecoin","ripple"]; // Add more cryptocurrencies if needed
  
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${currencies.join(",")}&vs_currencies=usd`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const pricesContainer = document.getElementById("prices");
        for (const currency of currencies) {
          const price = data[currency].usd;
          const currencyElement = document.createElement("div");
          currencyElement.textContent = `${currency.toUpperCase()}: $${price}`;
          pricesContainer.appendChild(currencyElement);
        }
      })
      .catch(error => {
        console.error('Error fetching cryptocurrency prices:', error);
        const pricesContainer = document.getElementById("prices");
        pricesContainer.textContent = "Error fetching cryptocurrency prices";
      });
  });
  