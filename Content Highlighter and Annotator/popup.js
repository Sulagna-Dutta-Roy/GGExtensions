document.getElementById("highlightBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: highlightSelection,
    });
  });
});

document.getElementById("clearBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: clearHighlights,
    });
  });
});

function highlightSelection() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0).cloneRange();
  const span = document.createElement("span");
  span.style.backgroundColor = "yellow";
  range.surroundContents(span);
  selection.removeAllRanges();
  selection.addRange(range);
}

function clearHighlights() {
  const spans = document.querySelectorAll(
    'span[style="background-color: yellow;"]'
  );
  spans.forEach((span) => {
    const parent = span.parentNode;
    parent.replaceChild(document.createTextNode(span.textContent), span);
    parent.normalize();
  });
}
