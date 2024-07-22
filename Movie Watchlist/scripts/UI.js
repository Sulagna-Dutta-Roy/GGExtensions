//func for movie ui
class UI{
    static numberOfImgs = 0;
    static numberOfLoadedImgs = 0;

    //remove title
    static removeCardComponent(list, title){
        if(DATA.lists[list].indexOf(title) != -1){
            $(`#wrapper div.list[data-list="${list}"] div.card[data-title="${title}"]`).remove();
        
            let n = parseInt($(`#wrapper div.list[data-list='${list}'] h2 span.size`).text()) - 1;
            $(`#wrapper div.list[data-list='${list}'] h2 span.size`).text(n);
        }
    }

    //favorite
    static addFavorite(title){
        $(`#wrapper div.card[data-title="${title}"] div.btn.favorite`).addClass("active");
        
        UI.addTitleToList(title, "Favorites");
    }

   //add title
    static addTitleToList(title, list){
        $(`#wrapper div.list[data-list='${list}'] div.container`).append(UI.cardComponent(
            title,
            DATA.all[title]["poster"],
            DATA.all[title]["release_date"],
            DATA.all[title]["favorite"],
            DATA.all[title]["watched"],
            "ADD"
        ));
        
        let n = parseInt($(`#wrapper div.list[data-list='${list}'] h2 span.size`).text()) + 1;
        $(`#wrapper div.list[data-list='${list}'] h2 span.size`).text(n);
        
        $(".btn, div.image, div.card").unbind();
        addListeners();
    }

    //mark title
    static removeFavorite(title){
        $(`#wrapper div.card[data-title="${title}"] div.btn.favorite`).removeClass("active");
        UI.removeCardComponent("Favorites", title);
    }

    //unmark
    static removeWatched(title){
        $(`#wrapper div.card[data-title='${title}'] div.btn.watched`).removeClass("active");
    }

    static addWatched(title){
        $(`#wrapper div.card[data-title='${title}'] div.btn.watched`).addClass("active");
    }

    /**
     * Create a movie card component
     * @param {String} title 
     * @param {String} poster_path 
     * @param {String} release_date 
     * @param {Boolean} favorite 
     * @param {Boolean} watched 
     * @returns 
     */
    static cardComponent(title, poster_path, release_date, favorite, watched, type){
        UI.numberOfImgs++;
        let img = '';
        if(type == "INIT")
            img = `<img src="img/loading.gif" data-src='${poster_path}' loading="lazy" draggable=false>`;
        else if(type == "ADD")
            img = `<img src="${poster_path}" loading="lazy" draggable=false>`;

        let html = `
            <div class="card" data-title="${title}" draggable=true>
                <div class="image">
                    ${img}
                </div>
                <div class="buttons">
                    <div class="btn favorite ${favorite ? "active" : ""}"><i class="fa-regular fa-heart unchecked"></i><i class="fa-solid fa-heart checked"></i></div>
                    <div class="btn watched ${watched ? "active" : ""}"><i class="fa-regular fa-circle-check unchecked"></i><i class="fa-solid fa-circle-check checked"></i></div>
                    <div class="btn remove"><i class="fa-regular fa-circle-xmark"></i></div>
                </div>
                <a>${title}</a>
                <p>${release_date}</p>
            </div>
        `;
        return html;
    }

    static listActionButtons(){
        return `<div class="list-buttons">
                    <div class="btn edit-list"><i class="fa-solid fa-pen"></i></div>
                    <div class="btn delete-list"><i class="fa-regular fa-circle-xmark"></i></div>
                </div>`
    }

    //display data
    static display(){
        UI.numberOfImgs = 0;
        UI.numberOfLoadedImgs = 0;
        
        let html = "";
        let options = `<li>
                            <label data-list="All">All <i class="fa-solid fa-check"></i></label>
                        </li>`;

        for(let list in DATA["lists"]){
            html += `<div class="list" data-list='${list}'>
                <h2><span><span class="name">${list}&nbsp</span><span class="size"> ${DATA.lists[list].length}</span></span>`;
                if(list !== "Favorites" && list !== "Bookmarks") html += UI.listActionButtons();
                html += `</h2><div class="container">`;
            for(let title of DATA["lists"][list]){
                html += UI.cardComponent(title, DATA['all'][title]['poster'], DATA['all'][title]['release_date'], DATA['all'][title]['favorite'], DATA['all'][title]['watched'], "INIT");
            }
            html += "</div></div>";
            options += `<li>
                            <label data-list="${list}">${list} <i class="fa-solid fa-check"></i></label>
                        </li>`
        }

        $("#wrapper").html(html);
        $(".checkbox-dropdown-list").html(options);
    }

    
   
    //   Filter displayed lists
   
    static filter(){
        let text = "";
        if(viewList.length == 0)
            text = "None";
        else if(viewList.length == 1)
            text = viewList[0];
        else
            text = "Custom";

        $("#checkbox-dropdown span").text(text)

        $("#wrapper div.list").each(function(){
            if(viewList[0] == "All")
                $(this).show();
            else{
                let list = $(this).attr("data-list");
                if(viewList.indexOf(list) == -1)
                    $(this).hide();
                else
                    $(this).show();
            }
        });
    }

    static deleteList(list){
        $(`#wrapper div.list[data-list='${list}']`).remove();
    }

    static renameList(list, newName){
        if(newName){
            $(`#wrapper div.list[data-list='${list}'] h2 span.name`).text(newName);
            $(`#wrapper div.list[data-list='${list}']`).attr("data-list", newName);
        }
    }
}