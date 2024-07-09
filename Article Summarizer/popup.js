// popup.js
document.addEventListener('DOMContentLoaded', function() {
  const summarizeButton = document.getElementById('summarize');
  const summaryDiv = document.getElementById('summary');
  const loader = document.getElementById('loader');

  summarizeButton.addEventListener('click', function() {
      summaryDiv.innerHTML = '';
      loader.style.display = 'block';
      summarizeButton.disabled = true;

      chrome.runtime.sendMessage({action: "summarize"}, function(response) {
          loader.style.display = 'none';
          summarizeButton.disabled = false;
          
          // Format the summary
          const sentences = response.summary.split('. ');
          const formattedSummary = sentences.map(sentence => 
              `<p><strong>${sentence.split(' ').slice(0, 3).join(' ')}</strong> ${sentence.split(' ').slice(3).join(' ')}</p>`
          ).join('');
          
          summaryDiv.innerHTML = formattedSummary;
      });
  });
});