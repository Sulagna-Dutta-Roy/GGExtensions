document.getElementById("start").addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: "start" });
});

document.getElementById("stop").addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: "stop" });
});
