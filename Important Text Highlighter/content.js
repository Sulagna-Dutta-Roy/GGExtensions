chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "highlight") {
    var selectedText = window.getSelection().toString().trim();
    if (selectedText !== "") {
      chrome.storage.sync.get({ highlights: [] }, function (data) {
        var highlights = data.highlights;
        highlights.push(selectedText);
        chrome.storage.sync.set({ highlights: highlights });
      });
    } else {
      var clickedText = "";
      if (window.getSelection) {
        clickedText = window.getSelection().toString().trim(); //Selcting the element and trimming it
      } else if (document.selection && document.selection.type != "Control") {
        clickedText = document.selection.createRange().text.trim();
      }
      if (clickedText !== "") {
        chrome.storage.sync.get({ highlights: [] }, function (data) {
          var highlights = data.highlights;
          highlights.push(clickedText);
          chrome.storage.sync.set({ highlights: highlights });
        });
      }
    }
  }
});
