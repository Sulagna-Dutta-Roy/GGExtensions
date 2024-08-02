let fontSwitch1 = "false";
let fontSwitch2 = "false";
let bgColor = "#000000";
let bgChange = "false";

chrome.storage.local.get(["fontSwitch1", "fontSwitch2", "bgColor", "bgChange"], (data) => {
    if(data.fontSwitch1 !== undefined){
        fontSwitch1 = data.fontSwitch1 ? "true" : "false";
    }
    if(data.fontSwitch2 !== undefined){
        fontSwitch2 = data.fontSwitch2 ? "true" : "false";
    }
    if(data.bgColor !== undefined){
        bgColor = data.bgColor;
    }
    if(data.bgChange !== undefined){
        bgChange = data.bgChange ? "true" : "false";
    }
});

chrome.runtime.onMessage.addListener((message, callback, sendResponse) => {
    if(message.fromFile === "popup.js"){
        if(message.data === "removeFonts"){
            fontSwitch1 = "false";
            fontSwitch2 = "false";
            chrome.storage.local.set({fontSwitch1: fontSwitch1, fontSwitch2: fontSwitch2});
        } else if(message.data === "fontSwitch1"){
            fontSwitch1 = message.state ? "true" : "false";
            chrome.storage.local.set({fontSwitch1: fontSwitch1});
        } else if(message.data === "fontSwitch2"){
            fontSwitch2 = message.state ? "true" : "false";
            chrome.storage.local.set({fontSwitch2: fontSwitch2});
        } else if(message.data === "backgroundChange"){
            bgColor = message.color;
            bgChange = message.state ? "true" : "false";
            chrome.storage.local.set({bgColor: bgColor, bgChange: bgChange});
        }
        sendResponse({fontSwitch1: fontSwitch1, fontSwitch2: fontSwitch2});
    } else if(message.fromFile === "contentScript.js"){
        sendResponse({fontSwitch1: fontSwitch1, fontSwitch2: fontSwitch2});
    }
});