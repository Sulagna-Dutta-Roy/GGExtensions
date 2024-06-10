document.addEventListener('DOMContentLoaded', () => {
    const dataElement = document.getElementById('data');
    const resetButton = document.getElementById('reset');

    // Function to display the data
    const displayData = () => {
        chrome.storage.local.get(null, data => {
            dataElement.innerHTML = '';
            for (const [url, time] of Object.entries(data)) {
                const timeInMinutes = (time / 1000 / 60).toFixed(2);
                dataElement.innerHTML += `<p>${url}: ${timeInMinutes} minutes</p>`;
            }
        });
    };

    // Initial display
    displayData();

    // Reset button functionality
    resetButton.addEventListener('click', () => {
        chrome.storage.local.clear(() => {
            dataElement.innerHTML = '';
        });
    });
});