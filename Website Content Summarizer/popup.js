document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentUrl = tabs[0].url;
    var apiUrl = 'https://parapager.onrender.com/api'; // Replace with your actual API endpoint

    var requestBody = {
      site: currentUrl
    };

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(response => response.json())
      .then(data => {
        var summaryElement = document.getElementById('summary');
        summaryElement.textContent = data.summary;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        var summaryElement = document.getElementById('summary');
        summaryElement.textContent = 'Error fetching data';
      });
  });
});
