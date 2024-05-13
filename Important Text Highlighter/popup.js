document.addEventListener("DOMContentLoaded", function () {
  var highlightList = document.getElementById("highlightList");

  // FUNCTION TO ADD HIGHLIGHTS
  function loadHighlights() {
    chrome.storage.sync.get({ highlights: [] }, function (data) {
      var savedHighlights = data.highlights;
      highlightList.innerHTML = "";
      savedHighlights.forEach(function (highlight, index) {
        var parts = highlight.split("|");
        var text = parts[0];
        var timestamp = parts[1];
        var url = parts[2];
        var listItem = document.createElement("li");
        listItem.textContent = text + " (Added: " + timestamp + ")";
        //CREATING URL FOR SMALL LIST
        var urlElement = document.createElement("small");
        urlElement.textContent = " - " + url;
        // CREATING A BOX FOR DELETION
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "checkbox" + index;
        // APPENDING THE ITEMS TO THE LIST URLs AND COPIED TEXT
        listItem.appendChild(urlElement);
        listItem.appendChild(checkbox);
        highlightList.appendChild(listItem);
      });
    });
  }

  loadHighlights();

  highlightButton.addEventListener("click", function () {
    var noteText = noteTextarea.value.trim();
    if (noteText !== "") {
      var timestamp = new Date().toLocaleString();
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var url = tabs[0].url;
        var highlight = noteText + "|" + timestamp + "|" + url;
        // ADD HIGHLIGHT TO STORAGE
        chrome.storage.sync.get({ highlights: [] }, function (data) {
          var highlights = data.highlights;
          highlights.push(highlight);
          chrome.storage.sync.set({ highlights: highlights }, function () {
            loadHighlights();
          });
        });
      });

      noteTextarea.value = "";
    }
  });

  removeButton.addEventListener("click", function () {
    var checkboxes = document.querySelectorAll("input[type='checkbox']");
    if (checkboxes.length > 0) {
      checkboxes.forEach(function (checkbox) {
        // UPDATE LIST
        if (checkbox.checked) {
          checkbox.parentNode.remove();
        }
      });
    } else {
      console.log("No checkboxes found.");
    }
    // REMOVING HIGHLIGHTS
    var updatedHighlights = [];
    var listItems = highlightList.querySelectorAll("li");
    listItems.forEach(function (item, index) {
      // CHECKBOX EMPTY CHEKING CODE
      if (!document.getElementById("checkbox" + index)?.checked) {
        var text = item.textContent.split(" (Added: ")[0];
        var timestamp = item.textContent.split(" (Added: ")[1].slice(0, -1);
        var url = item.querySelector("small").textContent.slice(3); // Remove "- " from URL
        updatedHighlights.push(text + "|" + timestamp + "|" + url);
      }
    });
    chrome.storage.sync.set({ highlights: updatedHighlights });
  });
});
