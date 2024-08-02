chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "getTrustScore") {
    const trustScore = calculateTrustScore(document.location.hostname);
    sendResponse({trustScore: trustScore});
  }
  return true; // Indicate that we will send a response asynchronously
});

function calculateTrustScore(hostname) {
  // Placeholder function for calculating the trust score.
  // In a real implementation, this might query a server or use stored data.
  const scores = {
    "example.com": "85/100",
    "test.com": "70/100",
  };
  return scores[hostname] || "Unknown";
}
