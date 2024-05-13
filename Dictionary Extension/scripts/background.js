chrome.contextMenus.create({
  id: "Dictionary",
  title: "Search in Dictionary",
  contexts: ["selection"],
});
chrome.contextMenus.onClicked.addListener(async function (clickData) {
  var meaning="";
  await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${clickData.selectionText}`)
  .then((response) => response.json())
  .then((json) => {
      console.log(json);
      if(json.title=="No Definitions Found"){
        meaning="No Definitions Found";
      }
      else{
        meaning=json[0].meanings[0].definitions;
      }
  });
  console.log(meaning);
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message: [meaning,clickData.selectionText]});
  });
});
