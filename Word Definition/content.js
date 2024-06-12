window.addEventListener("mouseup", handleSelection);

var selectedText;

function handleSelection() {
  selectedText = window.getSelection().toString().replace(/\s/g, "");
}

// receive the message from popup.
chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
  let msg =
    selectedText && selectedText.length > 0
      ? selectedText
      : "_TextNotSelected_";

  // send the selected text to the popup.js as a response to the message.
  sendResponse({ swor: msg });
}