document.addEventListener("DOMContentLoaded", () => {
  const waterIntakeDisplay = document.getElementById("water-intake");
  const addWaterButton = document.getElementById("add-water");
  const resetWaterButton = document.getElementById("reset-water");

  // Initialize the display with the current water intake
  chrome.storage.sync.get(["waterIntake"], (result) => {
    const waterIntake = result.waterIntake || 0;
    waterIntakeDisplay.textContent = `${waterIntake} ml`;
  });

  addWaterButton.addEventListener("click", () => {
    chrome.storage.sync.get(["waterIntake"], (result) => {
      let waterIntake = result.waterIntake || 0;
      waterIntake += 250;
      chrome.storage.sync.set({ waterIntake }, () => {
        waterIntakeDisplay.textContent = `${waterIntake} ml`;
      });
    });
  });

  resetWaterButton.addEventListener("click", () => {
    chrome.storage.sync.set({ waterIntake: 0 }, () => {
      waterIntakeDisplay.textContent = "0 ml";
    });
  });
});
