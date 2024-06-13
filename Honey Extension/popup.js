document.getElementById("set-threshold").addEventListener("click", () => {
  const threshold = document.getElementById("threshold").value;
  chrome.storage.sync.set({priceDropThreshold: threshold}, () => {
    console.log("Price drop threshold set to", threshold);
  });
});
