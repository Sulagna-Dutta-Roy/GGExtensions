const checkbox1 = document.querySelector("#fontSwitch1");
const checkbox2 = document.querySelector("#fontSwitch2");
const bgChangeCheckbox = document.querySelector("#bgChange");
const bgColorPicker = document.querySelector("#bgColorPicker");

renderCheckboxes();

bgChangeCheckbox.addEventListener('change', sendBackgroundChange);
bgColorPicker.addEventListener('input', sendBackgroundChange);

function sendBackgroundChange() {
    chrome.runtime.sendMessage({
        data: "backgroundChange", 
        state: bgChangeCheckbox.checked, 
        color: bgColorPicker.value, 
        fromFile: "popup.js"
    });
    reloadActiveTab();
}


checkbox1.addEventListener('click', () => {
    if (checkbox1.checked && checkbox2.checked) {
        checkbox1.checked = false;
        checkbox2.checked = false;
        chrome.runtime.sendMessage({data: "removeFonts", fromFile: "popup.js"});
    } else {
        chrome.runtime.sendMessage({data: "fontSwitch1", state: checkbox1.checked, fromFile: "popup.js"});
    }
    reloadActiveTab();
});

checkbox2.addEventListener('click', () => {
    if (checkbox1.checked && checkbox2.checked) {
        checkbox1.checked = false;
        checkbox2.checked = false;
        chrome.runtime.sendMessage({data: "removeFonts", fromFile: "popup.js"});
    } else {
        chrome.runtime.sendMessage({data: "fontSwitch2", state: checkbox2.checked, fromFile: "popup.js"});
    }
    reloadActiveTab();
});

function renderCheckboxes(){
    chrome.runtime.sendMessage({data: "fontSwitch1", fromFile: "popup.js"}, (response) => {
        checkbox1.checked = response.fontSwitch1 === "true";
    });
    chrome.runtime.sendMessage({data: "fontSwitch2", fromFile: "popup.js"}, (response) => {
        checkbox2.checked = response.fontSwitch2 === "true";
    });
}

function reloadActiveTab() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.reload(tabs[0].id);
    });
}