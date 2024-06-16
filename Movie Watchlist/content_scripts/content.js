let contentScript = new ContentScript(
    ["div.TzHB6b.Hwkikb.WY0eLb:has(div[data-attrid='kc:/film/film:media_actions_wholepage'])",
    "div.TzHB6b.Hwkikb.WY0eLb:has(div[data-attrid='kc:/tv/tv_program:media_actions_wholepage'])"],
    ["div.PZPZlf.ssJ7i.B5dxMb[data-attrid=title]", "div.PZPZlf.ssJ7i.xgAzOe[data-attrid=title]"],
    ["span.LrzXr.kno-fv.wHYlTd.z8gr9e"],
    ["div[jsname=xQjRM]"],
    "quickActionsGoogle.html"
);

// for running the script each time the page updates (reload/ajax call)
const observer = new MutationObserver(function(mutation){
    // If the #gsr element : style to overflow: hidden set the contentScript's state as off
    if(mutation[0].target.style.overflow == "hidden")
        contentScript.state = "off";
    
    // Run the contentScript only if it wasn't run before
    if(mutation[0].target.style.overflow != "hidden" && contentScript.state === "off")
        contentScript.run();
});

if(document.querySelector("#gsr") != null){
    observer.observe(document.querySelector("#gsr"), {attributes: true, childList: true});
}

contentScript.run();