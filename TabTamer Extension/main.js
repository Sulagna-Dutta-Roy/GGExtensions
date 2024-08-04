document.getElementById('listTabs').addEventListener('click', () => {
    chrome.tabs.query({}, (tabs) => {
        const tabList = document.getElementById('tabList');
        tabList.innerHTML = ''; // Clear previous tab list
        tabs.forEach(tab => {
            const tabItem = document.createElement('div');
            tabItem.className = 'tab-item';
            tabItem.textContent = tab.title; // Display tab title
            tabList.appendChild(tabItem);
        });
    });
});
