// get the currently active tab in the current window
// and then invoke the callback function gotTabs.
let query = { active: true, currentWindow: true };
chrome.tabs.query(query, gotTabs);

// function to check current url and eliminate offline urls.
function safeUrl(url) {
  return url.startsWith("https://") || url.startsWith("http://");
}

// callback function
function gotTabs(tabs) {
  // prevent offline urls to run the extension by throwing error.
  if (!safeUrl(tabs[0].url)) {
    document.getElementById("error").innerHTML = "Oh no!";
    document.getElementById("definition").innerHTML = "Unsupported Page.";
    return;
  }

  let msg = {
    txt: "hello from popup",
  };

  // send message to the content script
  chrome.tabs.sendMessage(tabs[0].id, msg, function (response) {
    if (!response) {
      document.getElementById("phonetic").innerHTML =
        "Refresh the page and try again.";
    } else if (response.swor === "_TextNotSelected_") {
      document.getElementById("phonetic").innerHTML = "Welcome!";
      document.getElementById("example").innerHTML =
        "Please select a word to find its definition.";
    } else {
      let swo = response.swor;
      swo = swo.replace(/[^a-zA-Z ]/g, "");
      dictionary(swo);
    }
  });
}

let wordef,
  word,
  phonetic,
  pos,
  defin,
  example,
  sourceurl,
  index = 0,
  indlimit;

// function to fetch and show definition on the popup
async function dictionary(query) {
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${query}`;
  let response = await fetch(url);
  wordef = await response.json();
  if (wordef && !wordef.title) {
    indlimit = wordef[0].meanings.length;
    word = wordef[0].word;
    phonetic = wordef[0].phonetic ? wordef[0].phonetic : "";
    sourceurl = `https://en.wiktionary.org/wiki/${word}`;
    index = 0;

    setValues();

    if (indlimit > 1) {
      document
        .getElementById("navigatecontainer")
        .classList.remove("hidenavigator");
    }
  } else if (wordef.title) {
    document.getElementById("error").innerHTML = "⚠  " + wordef.title;
  }
}

document.getElementById("prev").addEventListener("click", handlePrevious);
document.getElementById("next").addEventListener("click", handleNext);

function handlePrevious() {
  index = index - 1;
  if (index < 0) index = indlimit - 1;
  setValues();
}

function handleNext() {
  index = index + 1;
  if (index >= indlimit) index = 0;
  setValues();
}

function setValues() {
  pos = wordef[0].meanings[index].partOfSpeech;
  defin = wordef[0].meanings[index].definitions[0].definition;
  example = wordef[0].meanings[index].definitions[0].example
    ? wordef[0].meanings[index].definitions[0].example
    : null;

  document.getElementById(
    "word"
  ).innerHTML = `${word} <a href=${sourceurl} class="searchanchor" target="_blank"><img class="searchsvg" title="read more" src = "../assets/searchonweb.svg" alt="read more"/><a>`;
  document.getElementById("phonetic").innerHTML = `${phonetic}  (${pos})`;
  document.getElementById("definition").innerHTML = defin;
  if (example) {
    document.getElementById("example").innerHTML = `Example: ${example}`;
  } else {
    document.getElementById("example").innerHTML = "";
  }
}