document.addEventListener('DOMContentLoaded', () => {
    const dataElement = document.getElementById('data');
    const resetButton = document.getElementById('reset');

    const displayData = () => {
        chrome.storage.local.get(null, data => {
            dataElement.innerHTML = '';
            for (const [url, time] of Object.entries(data)) {
                const timeInMinutes = (time / 1000 / 60).toFixed(2);
                dataElement.innerHTML += `
            <div class="site">
              <p>${url}</p>
              <p>${timeInMinutes} min</p>
            </div>`;
            }
        });
    };

    displayData();

    resetButton.addEventListener('click', () => {
        chrome.storage.local.clear(() => {
            dataElement.innerHTML = '';
        });
    });
});