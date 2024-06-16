class ContentScript{
    /**
     * @param {Array <String>} htmlTarget for the element in which the controls will be added with .insertAdjancentHTML()
     * @param {Array <String>} title for the element that contains the title
     * @param {Array <String>} date for the element that contains the release date
     * @param {String} defaultControls  for the element that contains default controls for a bookmarking system (optional)
     * @param {String} path for the html source 
    */
    constructor(htmlTarget, title, date, defaultControls = null, path){
        this.htmlQuery = htmlTarget;
        this.titleQuery = title;
        this.htmlSourcePath = path;
        this.defaultControlsQuery = defaultControls;
        this.dateQuery = date;

        this.isBookmarked = false;
        this.isExtensionActive = true;

        this.getData();

        this.state = "off";

        this.type = null;
    }

    getHtml(){
        this.html = null;
        let i = 0;
        while(i < this.htmlQuery.length && !this.html){
            this.html = document.querySelector(this.htmlQuery[i++]);
        }
    }

    getTitle(){
        this.title = null;
        let i = 0;
        while(i < this.titleQuery.length && !this.title){
            this.title = document.querySelector(this.titleQuery[i++]);
        }
        this.title = this.title.innerText;

        console.log("Title:", this.title);
    }

    getDate(){
        this.date = document.querySelector(this.dateQuery).innerText.split('(')[0];
    }

    getDefaultControls(){
        this.defaultControls = null;
        let i = 0;
        while(i < this.defaultControlsQuery.length && !this.defaultControls){
            this.defaultControls = this.html.querySelector(this.defaultControlsQuery[i++]);
        }
    }

    async fetchHTML(path){
        return fetch(chrome.runtime.getURL(path))
            .then(res => res.text())
            .then(html => {
                this.html.insertAdjacentHTML("afterbegin", html);
                document.querySelector("#MovieBookmark-selector img").src = chrome.runtime.getURL("img/img2.png");
                this.setColorTheme();
            });
        
    }

    async run(){
        if(this.isMovieShow()){
            // Set the state to "on" to indicate that the contentScript was already run
            this.state = "on";

            this.getHtml();
            this.getTitle();
            this.getDefaultControls();
            this.getDate();

            this.defaultControls.style.display = "none";
            await this.fetchHTML(this.htmlSourcePath);


            this.addListButtons(this);

            let that = this;
            this.DATA.lists["Bookmarks"].forEach(e => {
                if(e === this.title && this.DATA["all"][e] !== undefined){
                    this.isBookmarked = true;
                    document.querySelector("#bookmark-btn").classList.toggle("active");
                }
            });

            document.querySelector("#bookmark-btn").addEventListener("click", async function(){
                this.classList.toggle("active");
                if(!that.isBookmarked){
                    await that.getIMDBData();
                    that.addToList("Bookmarks", that.title, that.date, that.poster);
                    that.isBookmarked = true;
                }
                else{
                    that.removeFromList("Bookmarks", that.title);
                    that.isBookmarked = false;
                }
            });

            document.querySelector("#mb-checkbox").addEventListener("click", () => {
                this.isExtensionActive = !this.isExtensionActive;
                if(!this.isExtensionActive){
                    this.defaultControls.style.display = "block";
                    document.querySelector("#MovieBookmark-Extension").style.display = "none";
                }
                else{
                    this.defaultControls.style.display = "none";
                    document.querySelector("#MovieBookmark-Extension").style.display = "block";
                }
            });
        }
    }

  

    async addToList(list, title, date, poster){

        if(this.DATA.lists[list].indexOf(title) == -1){
            if(!this.DATA.all[title]){
                this.DATA.all[title] = {
                    poster: poster,
                    release_date: date,
                    watched: false,
                    favorite: false,
                    refs: 1
                }
            }
            else{
                this.DATA.all[title].refs++;
            }

            this.DATA.lists[list].push(title);
            
            this.save();
        }
    }

    removeFromList(list, title){
        this.DATA.lists[list] = this.DATA.lists[list].filter(e => e !== title);
        this.DATA.all[title].refs--;
        if(this.DATA.all[title].refs <= 0){
            delete this.DATA.all[title];
            this.DATA.lists["Favorites"] = this.DATA.lists["Favorites"].filter(e => e !== title);
        }

        this.save();
    }

    save(){
        this.DATA["saved"] = "externally";
        console.log("saving", this.DATA);
        chrome.storage.local.set({mbe_data: this.DATA});
    }
    
    async getData(){
        return new Promise((resolve) => {
            chrome.storage.local.get(["mbe_data"], resolve);
        }).then(res => {
            if(res["mbe_data"]){
                this.DATA = res["mbe_data"];
            }
            else{
                this.DATA = {
                    "all": {},
                    "lists": {
                        "Bookmarks": [],
                        "Favorites": []
                    }
                }
            }
            console.log(this.DATA);
        });
    }



    isMovieShow(){
        let test = document.querySelector(this.htmlQuery[0]);
        if(test) {
            this.type = "film";
            return true;
        }
        else {
            test = document.querySelector(this.htmlQuery[1]);
            if(test){
                this.type = "show";
                return true;
            }
        }

        return false;
    }

    getIMDBData(){
        let imdbURL = document.querySelector("div.TzHB6b.cLjAic.K7khPe a[href^='https://www.imdb.com/']").getAttribute("href");

        let p = window.sessionStorage.getItem(`${this.title}_poster`);
        let d = window.sessionStorage.getItem(`${this.title}_date`);
        if((p && p != "") && (d && d != "")){
            this.poster = p;
            this.date = d;
        }
        else
            return new Promise((resolve) => {
                chrome.runtime.sendMessage({action: "getDataFromIMDB", url: imdbURL}, resolve);
            }).then((res) => {
                this.poster = res.poster;
                if(this.type == "show")
                    this.date = res.date;

                window.sessionStorage.setItem(`${this.title}_poster`, this.poster);
                window.sessionStorage.setItem(`${this.title}_date`, this.date);

                console.log(this.poster, this.date);
            });
    }

    setColorTheme(){
        if(window.getComputedStyle(document.body).getPropertyValue("background-color") != "rgb(32, 33, 36)"){
            document.querySelector("#MovieBookmark-Extension").classList.add("light");
            document.querySelector("#MovieBookmark-selector").classList.add("light");
        }
        else{
            document.querySelector("#MovieBookmark-Extension").classList.add("dark");
            document.querySelector("#MovieBookmark-selector").classList.add("dark");
        }
    }

    addListButtons(that){
        let h = "";
        for(let list in this.DATA.lists){
            if(list != "Bookmarks" && list != "Favorites"){
                let c = null;
                if(this.DATA.lists[list].indexOf(this.title) != -1)
                    c = "active";
                h += `<li class='${c}' data-list='${list}'>${list}</li>`;
            }
        }
        document.querySelector("#movie-lists").innerHTML = h;

        document.querySelectorAll("#movie-lists li").forEach(e => e.addEventListener("click", async function(){
            let list = this.getAttribute("data-list");
            let inList = this.classList.contains("active");
            
            this.classList.toggle("active");
            if(!inList){
                await that.getIMDBData();
                that.addToList(list, that.title, that.date, that.poster);
            }
            else{
                that.removeFromList(list, that.title);
            }
            
        }));

        document.querySelector("#list-new").addEventListener("click", function(){
            let list = prompt("Create new list. Enter new list name");
            if(list){
                that.DATA.lists[list] = [];
                that.save();
                that.addListButtons(that);
            }
        });
    }

   
}