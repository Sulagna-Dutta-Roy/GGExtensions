document.getElementById('scrapeForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const url = document.getElementById('urlInput').value;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scrapeData,
      args: [url],
    }, (results) => {
      const result = results[0].result;
      document.getElementById('output').textContent = result;
      const downloadButtons = document.getElementById('downloadButtons');
      downloadButtons.style.display = 'block';
      document.getElementById('downloadTxtButton').onclick = () => downloadData(result, 'scraped_data.txt', 'text/plain');
      document.getElementById('downloadCsvButton').onclick = () => downloadData(generateCSV(result), 'scraped_data.csv', 'text/csv');
    });
  } catch (error) {
    document.getElementById('output').textContent = 'Error fetching data: ' + error.message;
  }
});

function scrapeData() {
  const paragraphs = document.querySelectorAll('p');
  let outputText = '';
  paragraphs.forEach(p => {
    outputText += p.textContent + '\n';
  });
  return outputText;
}

function downloadData(data, filename, type) {
  const blob = new Blob([data], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function generateCSV(text) {
  const rows = text.split('\n').map(row => row.trim()).filter(row => row.length > 0);
  let csvContent = rows.join('\n');
  return csvContent;
}
