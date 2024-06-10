chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "addToWishlist") {
        addToWishlist(message.text);
    } else if (message.action === "trackPrice") {
        trackPrice(message.text);
    } else if (message.action === "findCoupons") {
        findCoupons(message.text);
    } else if (message.action === "comparePrices") {
        comparePrices(message.text, (prices) => {
            chrome.runtime.sendMessage({ action: "displayPriceComparison", prices });
        });
    }
});

const addToWishlist = (text) => {
    const product = extractProductDetails(text);
    saveToStorage('wishlist', product);
};

const trackPrice = (text) => {
    const product = extractProductDetails(text);
    saveToStorage('trackedProducts', product);
};

const findCoupons = (text) => {
    fetchCoupons(text, (coupons) => {
        chrome.runtime.sendMessage({ action: "displayCoupons", coupons });
    });
};

const comparePrices = (text, callback) => {
    fetchPriceComparisons(text, callback);
};

const extractProductDetails = (text) => {
    // Implement product details extraction logic
    return {
        name: text,
        url: window.location.href,
        price: parseFloat(document.querySelector('.price').textContent.replace('$', ''))
    };
};

const saveToStorage = (key, value) => {
    chrome.storage.local.get([key], (result) => {
        const items = result[key] ? result[key] : [];
        items.push(value);
        chrome.storage.local.set({ [key]: items });
    });
};