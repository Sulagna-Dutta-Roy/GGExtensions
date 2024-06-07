document.getElementById("enableReadingMode").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["content.js"],
    });
  });
});

document.getElementById("disableReadingMode").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: disableReadingMode,
    });
  });
});

function disableReadingMode() {
  document.body.style.backgroundColor = "";
  document.body.style.color = "";
  document.body.style.margin = "";
  document.body.style.padding = "";
  const elements = document.querySelectorAll(".reading-mode");
  elements.forEach((el) => {
    el.style.display = "";
  });
}
