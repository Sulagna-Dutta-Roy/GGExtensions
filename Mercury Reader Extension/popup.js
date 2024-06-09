document.addEventListener("DOMContentLoaded", function () {  const activateReaderButton = document.getElementById("activateReader");
  activateReaderButton.addEventListener("click", function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      const tab = tabs[0];
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: activateReaderMode,
      });
    });
  });
});

function activateReaderMode() {
  // Remove distracting elements
  document
    .querySelectorAll("img, iframe, video, audio, embed, object")
    .forEach((element) => {
      element.remove();
    });

  // Remove ads (you may need to customize this selector based on your needs)
  document
    .querySelectorAll(
      ".ad, .advertisement, .ads, .ad-banner, .ad-container, .ad-wrapper"
    )
    .forEach((ad) => {
      ad.remove();
    });

  // Remove unnecessary styling
  document
    .querySelectorAll('style, link[rel="stylesheet"]')
    .forEach((style) => {
      style.remove();
    });

  // Remove formatting (you may need to customize this selector based on your needs)
  document
    .querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, div, ul, ol, li, a")
    .forEach((element) => {
      element.style.fontFamily = "Arial, sans-serif";
      element.style.fontSize = "16px";
      element.style.lineHeight = "1.6";
      element.style.margin = "0";
      element.style.padding = "0";
    });

  // Optionally, adjust text color and background color for better readability
  document.body.style.color = "#333";
  document.body.style.backgroundColor = "#fff";
}
