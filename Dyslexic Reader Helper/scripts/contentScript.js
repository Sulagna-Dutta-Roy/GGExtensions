chrome.runtime.sendMessage({data: "getFontSwitchState", fromFile: "contentScript.js"}, response => {
    if (response.fontSwitch1 === "true" && response.fontSwitch2 === "true") {
        removeCustomFonts();
    } else if (response.fontSwitch1 === "true") {
        applyOpenDyslexicFont();
    } else if (response.fontSwitch2 === "true") {
        applyLexieReadableFont();
    } else {
        removeCustomFonts();
    }
});

chrome.storage.local.get(["bgColor", "bgChange"], (data) => {
    if(data.bgChange === "true"){
        let allElements = document.querySelectorAll('*');
        allElements.forEach((element) => {
            element.style.backgroundColor = data.bgColor;
        });
    }
});
function removeCustomFonts() {
    var customStyles = document.querySelectorAll('.custom-font-style');
    customStyles.forEach(function(style) {
        style.remove();
    });
}

function applyOpenDyslexicFont() {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        @font-face {
            font-family: 'OpenDyslexic';
            src: url('${chrome.runtime.getURL("fonts/open-dyslexic-font/OpenDyslexic3-Regular.ttf")}') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        @font-face {
            font-family: 'OpenDyslexic';
            src: url('${chrome.runtime.getURL("fonts/open-dyslexic-font/OpenDyslexic3-Bold.ttf")}') format('truetype');
            font-weight: bold;
            font-style: normal;
        }
        * {
            font-family: 'OpenDyslexic', sans-serif !important;
        }`;
    document.head.appendChild(style);
}

function applyLexieReadableFont() {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        @font-face {
            font-family: 'LexieReadable';
            src: url('${chrome.runtime.getURL("fonts/lexie-readable/LexieReadable-Regular.ttf")}') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        @font-face {
            font-family: 'LexieReadable';
            src: url('${chrome.runtime.getURL("fonts/lexie-readable/LexieReadable-Bold.ttf")}') format('truetype');
            font-weight: bold;
            font-style: normal;
        }
        * {
            font-family: 'LexieReadable', sans-serif !important;
        }`;
    document.head.appendChild(style);
}
