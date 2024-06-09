chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "addToWishlist",
        title: "Add to Wishlist",
        contexts: ["selection"]
    });

    chrome.contextMenus.create({
        id: "trackPrice",
        title: "Track Price",
        contexts: ["selection"]
    });

    chrome.contextMenus.create({
        id: "findCoupons",
        title: "Find Coupons",
        contexts: ["selection"]
    });

    chrome.alarms.create("checkPrices", { periodInMinutes: 60 });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "addToWishlist") {
        chrome.tabs.sendMessage(tab.id, { action: "addToWishlist", text: info.selectionText });
    } else if (info.menuItemId === "trackPrice") {
        chrome.tabs.sendMessage(tab.id, { action: "trackPrice", text: info.selectionText });
    } else if (info.menuItemId === "findCoupons") {
        chrome.tabs.sendMessage(tab.id, { action: "findCoupons", text: info.selectionText });
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "checkPrices") {
        checkPriceChanges();
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "syncData") {
        // Implement data synchronization logic
        sendResponse({ success: true });
    }
});

const checkPriceChanges = () => {
    chrome.storage.local.get(["trackedProducts"], (result) => {
        const products = result.trackedProducts || [];
        products.forEach(product => {
            fetchProductDetails(product.url, (details) => {
                if (details.price < product.price) {
                    chrome.notifications.create('', {
                        title: 'Price Drop Alert',
                        message: `The price of ${product.name} has dropped to ${details.price}`,
                        iconUrl: 'icons/icon48.png',
                        type: 'basic'
                    });
                    product.price = details.price;
                    chrome.storage.local.set({ trackedProducts: products });
                }
            });
        });
    });
};

const fetchProductDetails = (url, callback) => {
    // Implement product details fetching logic
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const price = parseFloat(doc.querySelector('.price').textContent.replace('$', ''));
            callback({ price });
        });
};