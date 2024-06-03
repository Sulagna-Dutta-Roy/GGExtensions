document.addEventListener("DOMContentLoaded", function() {
    const socialMediaSites = ["facebook.com", "twitter.com", "instagram.com"];
    const inputs = {};
    socialMediaSites.forEach((site) => {
      inputs[site] = document.getElementById(site.split(".")[0]);
    });
  
    // Function to create notification
    function createNotification(message) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "Time Limit",
        message: message
      });
    }
  
    // Gets the chrome local storage
    chrome.storage.sync.get(["siteLimits"], (result) => {
      const siteLimits = result.siteLimits || {};
      socialMediaSites.forEach((site) => {
        inputs[site].value = siteLimits[site] || 30; // Default to 30 minutes if not set
      });
    });
  
    // Update new site limit to chrome local storage
    document.getElementById("save").addEventListener("click", () => {
      const siteLimits = {};
      socialMediaSites.forEach((site) => {
        siteLimits[site] = parseInt(inputs[site].value, 10);
      });
      chrome.storage.sync.set({ siteLimits }, () => {
        createNotification("Time limit saved");
      });
    });
  
    // Clear the chrome local storage and resets the timer
    document.getElementById("reset").addEventListener("click", () => {
      chrome.storage.sync.remove(["siteLimits"], () => {
        const siteLimits = {};
        socialMediaSites.forEach((site) => {
          inputs[site].value = 30;
          siteLimits[site] = parseInt(inputs[site].value, 10);
        });
        chrome.storage.sync.set({ siteLimits }, () => {
          createNotification("Time limit resets to default");
        });
      });
    });
  });
  