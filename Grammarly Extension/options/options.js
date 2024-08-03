document.getElementById("style").addEventListener("change", (event) => {
  chrome.storage.sync.set({style: event.target.value});
});

chrome.storage.sync.get("style", (data) => {
  if (data.style) {
    document.getElementById("style").value = data.style;
  }
});
