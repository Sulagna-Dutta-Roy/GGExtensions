document.addEventListener('DOMContentLoaded', () => {
    const maxMoneyInput = document.getElementById('max-money');
    const maxItemsInput = document.getElementById('max-items');
    const cartItemsDiv = document.getElementById('cart-items');
    const addItemButton = document.getElementById('add-item');
    const settingsForm = document.getElementById('settings-form');
  
    chrome.storage.sync.get(['maxMoney', 'maxItems', 'cartItems'], (result) => {
      maxMoneyInput.value = result.maxMoney || '';
      maxItemsInput.value = result.maxItems || '';
      displayCartItems(result.cartItems || []);
    });
  
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const maxMoney = maxMoneyInput.value;
      const maxItems = maxItemsInput.value;
  
      chrome.storage.sync.set({ maxMoney: parseFloat(maxMoney), maxItems: parseInt(maxItems, 10) });
    });
  
    addItemButton.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url;
        const title = tabs[0].title;
  
        chrome.storage.sync.get(['cartItems', 'maxItems'], (result) => {
          const cartItems = result.cartItems || [];
          if (result.maxItems && cartItems.length >= result.maxItems) {
            alert('Item limit reached');
            return;
          }
  
          cartItems.push({ title, url });
          chrome.storage.sync.set({ cartItems }, () => {
            displayCartItems(cartItems);
          });
        });
      });
    });
  
    function displayCartItems(cartItems) {
      cartItemsDiv.innerHTML = '';
      cartItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('card', 'mb-2');
        itemDiv.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text"><a href="${item.url}" target="_blank">${item.url}</a></p>
            <button class="btn btn-danger remove-item" data-index="${index}">Remove</button>
          </div>
        `;
        cartItemsDiv.appendChild(itemDiv);
      });
  
      document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
          const index = button.getAttribute('data-index');
          cartItems.splice(index, 1);
          chrome.storage.sync.set({ cartItems }, () => {
            displayCartItems(cartItems);
          });
        });
      });
    }
  });
  