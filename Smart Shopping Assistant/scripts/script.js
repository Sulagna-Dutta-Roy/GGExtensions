document.addEventListener('DOMContentLoaded', () => {
    loadItems('wishlist', 'wishlistList');
    loadItems('trackedProducts', 'trackedProductsList');
    loadCoupons();
});

const loadItems = (key, listId) => {
    chrome.storage.local.get([key], (result) => {
        const items = result[key] ? result[key] : [];
        const list = document.getElementById(listId);
        list.innerHTML = '';
        items.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} - $${item.price}`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteItem(key, index, listId);
            listItem.appendChild(deleteButton);
            list.appendChild(listItem);
        });
    });
};

const deleteItem = (key, index, listId) => {
    chrome.storage.local.get([key], (result) => {
        const items = result[key] ? result[key] : [];
        items.splice(index, 1);
        chrome.storage.local.set({ [key]: items }, () => {
            loadItems(key, listId);
        });
    });
};

const loadCoupons = () => {
    const list = document.getElementById('couponsList');
    list.innerHTML = '';
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "displayCoupons") {
        displayCoupons(message.coupons);
    } else if (message.action === "displayPriceComparison") {
        displayPriceComparison(message.prices);
    }
});

const displayCoupons = (coupons) => {
    const list = document.getElementById('couponsList');
    list.innerHTML = '';
    coupons.forEach(coupon => {
        const listItem = document.createElement('li');
        listItem.textContent = `${coupon.code} - ${coupon.discount}`;
        list.appendChild(listItem);
    });
};

const displayPriceComparison = (prices) => {
    const list = document.getElementById('priceComparisonList');
    list.innerHTML = '';
    prices.forEach(price => {
        const listItem = document.createElement('li');
        listItem.textContent = `${price.store} - $${price.price}`;
        list.appendChild(listItem);
    });
};