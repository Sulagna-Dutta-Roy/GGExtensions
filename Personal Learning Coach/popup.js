document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ action: "getRecommendations" }, (response) => {
      let recommendationsDiv = document.getElementById('recommendations');
      if (response && response.length) {
        response.forEach((rec) => {
          let div = document.createElement('div');
          div.className = 'recommendation';
          let link = document.createElement('a');
          link.href = rec.url;
          link.textContent = rec.title;
          link.target = '_blank';
          div.appendChild(link);
          recommendationsDiv.appendChild(div);
        });
      } else {
        recommendationsDiv.textContent = "No recommendations available.";
      }
    });
  });
  