document.addEventListener("DOMContentLoaded", () => {  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {message: "getTrustScore"},
      (response) => {
        if (response && response.trustScore) {
          document.getElementById("trustScore").textContent =
            response.trustScore;
        } else {
          document.getElementById("trustScore").textContent =
            "Unable to retrieve trust score.";
        }
      }
    );
  });
});
