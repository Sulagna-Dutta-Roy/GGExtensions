chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "highlightText",
    title: "Highlight Text",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "clearHighlights",
    title: "Clear Highlights",
    contexts: ["page"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "highlightText") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: highlightSelection,
    });
  } else if (info.menuItemId === "clearHighlights") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: clearHighlights,
    });
  }
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
