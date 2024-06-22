const commands = {
  "go back": () => {
    chrome.tabs.executeScript({ code: "history.back();" });
  },
  "go forward": () => {
    chrome.tabs.executeScript({ code: "history.forward();" });
  },
  reload: () => {
    chrome.tabs.executeScript({ code: "location.reload();" });
  },
  "open new tab": () => {
    chrome.tabs.create({ url: "https://www.google.com" });
  },
  "close tab": () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.remove(tabs[0].id);
    });
  },
};

function handleCommand(command) {
  if (commands[command]) {
    commands[command]();
  } else {
    console.log(`Command "${command}" not recognized.`);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("Voice Commands for Browser Navigation extension installed.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "start") {
    startRecognition();
  } else if (message.command === "stop") {
    stopRecognition();
  }
});

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = "en-US";

recognition.addEventListener("result", (e) => {
  const transcript = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");

  if (e.results[0].isFinal) {
    handleCommand(transcript.trim().toLowerCase());
  }
});

recognition.addEventListener("end", () => {
  if (isRecognizing) {
    recognition.start();
  }
});

let isRecognizing = false;

function startRecognition() {
  if (!isRecognizing) {
    recognition.start();
    isRecognizing = true;
  }
}

function stopRecognition() {
  if (isRecognizing) {
    recognition.stop();
    isRecognizing = false;
  }
}
