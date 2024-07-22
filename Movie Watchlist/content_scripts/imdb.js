if(window.location.search == "?moviewatchlistextension"){
    window.addEventListener("load", function(){
        let url = document.querySelector("div.ipc-media.ipc-media--poster-27x40.ipc-image-media-ratio--poster-27x40.ipc-media--baseAlt.ipc-media--poster-l.ipc-poster__poster-image.ipc-media__img img").getAttribute("src");
        let date = document.querySelector("ul.ipc-inline-list.ipc-inline-list--show-dividers.sc-afe43def-4.kdXikI.baseAlt li[role='presentation'] a");
        if(date != null)
            date = date.innerText;
        
        console.log(url, date);
        chrome.runtime.sendMessage({action: "fetchedData", url: url, date: date});
        window.close();
    });
}
