let DATA = null;
let viewList = [];




$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

function showImgsIfInViewport(){
    $("img[data-src]").each(function(){
        let $i = $(this);
        if($i.isInViewport()){
            UI.numberOfLoadedImgs++;
            $i.attr("src", $i.attr("data-src")).removeAttr("data-src");

            if(UI.numberOfLoadedImgs == UI.numberOfImgs)
                $(window).unbind();
        }
    });
}

chrome.storage.onChanged.addListener((changes, namespace) => {
    if(namespace == "local" && changes["mbe_data"]["newValue"]["saved"] == "externally"){
        DATA = changes["mbe_data"]["newValue"];
        console.log(DATA);
        UI.display();
        addListeners();
        showImgsIfInViewport();
    }
});

$(window).on("load", async () => {
    DATA = await DataManager.getData();
    console.log(DATA);
    UI.display();
    addListeners();
    addPermanentListeners();
    showImgsIfInViewport();
});


function addListeners(){
    $(window).on('scroll', showImgsIfInViewport);

    //QA options

    $(".btn.delete-list").click(function(){
        let list = $(this).parent().parent().parent().attr("data-list");

        DataManager.deleteList(list);
        DataManager.saveData();
        UI.deleteList(list);
    });

    $(".btn.edit-list").click(function(){
        let list = $(this).parent().parent().parent().attr("data-list");

        let newName = DataManager.renameList(list);
        DataManager.saveData();
        UI.renameList(list, newName);
    });

    $(".btn.remove").click(function(){
        let movie = $(this).parent().parent().attr("data-title");
        let list = $(this).parent().parent().parent().parent().attr("data-list");

        DataManager.removeTitleFromList(movie, list);
        DataManager.saveData();
    });

    $(".btn.favorite").click(function(){
        let movie = $(this).parent().parent().attr("data-title");

        DataManager.favoriteHandler(movie);
        DataManager.saveData();
    });
    
    $(".btn.watched").click(function(){
        let movie = $(this).parent().parent().attr("data-title");
        
        DataManager.watchedHandler(movie, this);
        DataManager.saveData();
    });
    
    $("div.image").click(function(){
        let movie = $(this).parent().attr("data-title");
        window.open(`https://google.com/search?q=${encodeURIComponent(movie)}`);
    });


    
   //drag and drop function
    $("div.card").on("dragstart", function(e){
        e.originalEvent.dataTransfer.setData("text", $(this).attr("data-title"));
    });

    $("div.list:not(div.list[data-list=Favorites])").on("drop", function(e){
        e.preventDefault();
        $(this).find("div.container").removeClass("is-hover");

        let title = e.originalEvent.dataTransfer.getData("text");
        let list = $(this).attr("data-list");

        if(DataManager.addTitleToList(title, list)){
            UI.addTitleToList(title, list);
            DataManager.saveData();
        }
    });

    $("div.list").on("dragover", function(e){
        e.preventDefault();
        $(this).find("div.container").addClass("is-hover");
    });

    $("div.list").on("dragleave", function(e){
        e.preventDefault();
        $(this).find("div.container").removeClass("is-hover");
    });


   //select

    $("label").on("click", function(){
        $(this).toggleClass("is-active")
        let list = $(this).attr("data-list");
        
        if($(this).hasClass("is-active")){
            if(list == "All"){
                viewList = ["All"];
                $("label").not($(this)).removeClass("is-active");
            }
            else{
                viewList.push(list);
                viewList = viewList.filter(l => l !== "All");
            }
        }
        else
            viewList = viewList.filter(l => l !== list);

        UI.filter();
    });

}

function addPermanentListeners(){
    //select from list

    $("#new").click(function(){
        DataManager.createList();
    });

    $("#checkbox-dropdown").click(function(){
        $(this).toggleClass("is-active");
    });

    $("#checkbox-dropdown ul").click(function(e){
        e.stopPropagation();
    });

//menu

    $("#file-btn").on("click", function(){
        $("#file-options").toggleClass("is-active");
    });

    $("#file-download").on("click", function(){
        let a = document.createElement("a");
        let file = new Blob([JSON.stringify(DATA)], {type: 'json'});
        a.href = URL.createObjectURL(file);
        a.download = "MoviesWatchlist.json";
        a.click();
    });

    $("#file-upload").on("click", function(){
        let i = document.createElement("input");
        i.type = "file";
        i.accept = ".json";
        i.click();
        $(i).on("change", function(){
            const reader = new FileReader();
            reader.onload = (e) => {
                DATA = JSON.parse(e.target.result);
                DataManager.saveData();
                window.location.reload();
            }
            reader.readAsText(i.files[0]);
        })
    });
}