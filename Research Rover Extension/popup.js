document.getElementById("summarize").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "getContent" }, (response) => {
        chrome.runtime.sendMessage({ action: "summarize", content: response.content }, (response) => {
          document.getElementById("summary").innerText = response.summary;
        });
      });
    });
  });
  