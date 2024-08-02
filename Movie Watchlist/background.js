chrome.action.onClicked.addListener(async () => {
    chrome.tabs.create({url: chrome.runtime.getURL('popup.html')});
});

async function getDataFromIMDB(url){

    chrome.tabs.create({url: url + "?moviewatchlistextension", active: false});
    return new Promise(resolve => {
        chrome.runtime.onMessage.addListener(resolve);
    }).then(res => {
        if(res.action == "fetchedData"){
            return {poster: res.url, date: res.date};
        }
    });
}

// link with extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.action == "getDataFromIMDB"){
        (async () => {
            let {poster, date} = await getDataFromIMDB(request.url);
            sendResponse({poster: poster, date: date});
        })();
    }
    return true;
});