var STYLE_ID = "SS-select-element";
var mouseOverNode;

function addCSS() {
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.innerHTML = '.SS_highlight {outline:4px solid yellow; box-shadow:0px 0px 19px 100vw rgba(0, 0, 0, 0.2); xxbackground-color:#e5e5e530; cursor:grab} ';
    document.getElementsByTagName('head')[0].appendChild(style);
}

function mouseOver(e) {
    e.target.classList.add("SS_highlight");
    mouseOverNode = e.target;
}

function mouseOut(e) {
    e.target.classList.remove("SS_highlight");
}

function mouseDown(e) {
    mouseOverNode.classList.remove("SS_highlight");
}

function mouseClick(e) {
    e.preventDefault();
    e.stopPropagation();
}

function mouseUp(e) {

    setTimeout(() => {
        document.removeEventListener('click', mouseClick, false);
        document.removeEventListener("mouseover", mouseOver, false);
        document.removeEventListener("mouseout", mouseOut, false);
        document.removeEventListener("mousedown", mouseDown, false);
        document.removeEventListener("mouseup", mouseUp, false);
    }, 100);

    const element = document.getElementById(STYLE_ID);
    if (element) {
        element.parentNode.removeChild(element);
    }

    mouseOverNode.classList.remove("SS_highlight");

    e.preventDefault();
    e.stopPropagation();

    let domRect = mouseOverNode.getBoundingClientRect()
    //console.log("rect", domRect);

    chrome.runtime.sendMessage({
        command: "afterSelectElement",
        params: {
            source: "afterSelectElement",
            height: domRect.height,
            width: domRect.width,
            top: domRect.top,
            left: domRect.left,
            devicePixelRatio: devicePixelRatio,
        }
    });

}

addCSS();

document.addEventListener('click', mouseClick, false);
document.addEventListener('mouseover', mouseOver, false);
document.addEventListener('mouseout', mouseOut, false);
document.addEventListener('mousedown', mouseDown, false);
document.addEventListener('mouseup', mouseUp, false);