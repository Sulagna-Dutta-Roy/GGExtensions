import { buildingsData } from "../../data/buildingsData.js";
import { game } from "../../data/gameData.js";
import { resources } from "../../data/resourcesData.js";
import { popsData } from "../../data/popsData.js";

export function buildingHTML(id){
    const city = document.getElementById("map-city");
    const farms = document.getElementById("map-farms");
    const manufactories = document.getElementById("map-manufactories");

    const building = buildingsData[id];

    let buildingHTML = `
    <div class="map-item map-item-${building.spriteSize} map-${building.spritePlace} map-${id}">
        <img src="./img/buildings/${id}.png" draggable="false">
    </div>`;

    if(building.spritePlace == "city")           city.innerHTML += buildingHTML;
    if(building.spritePlace == "farms")          farms.innerHTML += buildingHTML;
    if(building.spritePlace == "manufactories")  manufactories.innerHTML += buildingHTML;
}

export function buildingsBootstrap(){
    for(const b in buildingsData){
        const count = document.querySelectorAll("map-"+b).length;

        if(game[b] > count){
            for(let i = 0; i < game[b]-count; i++){
                buildingHTML(b);
            }
        }
    }

    buildinglisteners();

    for(const b in buildingsData){
        tippy("#add-"+b, {
            content: buildingDescription(buildingsData[b]),
            maxWidth: 250,
            placement: "right",
            allowHTML: true,
            interactive: true,
            theme: "townrise",
        });
    }
}

export function buildingsDescriptionUpdate(){
    for(const b in buildingsData){
        document.querySelector("#add-"+b)._tippy.setContent(buildingDescription(buildingsData[b]));
    }
}

function buildingDescription(building){
    let contentHTML = `<div class="building-tippy">`;

    if(building.hasOwnProperty("jobs") && Object.keys(building.jobs).length > 0){
        contentHTML += `<p>Empregos</p><ul>`;
        for(const k in building.jobs){
            contentHTML += `<li>${popsData[k].name+": "}${building.jobs[k]}</li>`;
        }
        contentHTML += `</ul>`;
    }

    if(Object.keys(building.build).length > 0){
        if(contentHTML != `<div class="building-tippy">`)
            contentHTML += "<hr>";

        contentHTML += `<p>Construir</p><ul>`;
        for(const k in building.build){
            contentHTML += "<li";
            if(game[k] < building.build[k])
                contentHTML += ` class="rlack"`;

            contentHTML += `>${resources[k].name+": "}${building.build[k]}</li>`;
        }
        contentHTML += `</ul>`;
    }

    if(Object.keys(building.maintenance).length > 0){
        if(contentHTML != `<div class="building-tippy">`)
            contentHTML += "<hr>";

        contentHTML += `<p>Manutenção</p><ul>`;
        for(const k in building.maintenance){
            contentHTML += `<li>${resources[k].name+": "}${building.maintenance[k]}</li>`;
        }
        contentHTML += `</ul>`;
    }

    if(building.hasOwnProperty("winter_needs") && Object.keys(building.winter_needs).length > 0){
        if(contentHTML != `<div class="building-tippy">`)
            contentHTML += "<hr>";

        contentHTML += `<p>Manutenção no Inverno</p><ul>`;
        for(const k in building.winter_needs){
            contentHTML += `<li>${resources[k].name+": "}${building.winter_needs[k]}</li>`;
        }
        contentHTML += `</ul>`;
    }

    if(Object.keys(building.production).length > 0){
        if(contentHTML != `<div class="building-tippy">`)
            contentHTML += "<hr>";

        contentHTML += `<p>Produção</p><ul>`;
        for(const k in building.production){
            contentHTML += `<li>${resources[k].name+": "}${building.production[k]}</li>`;
        }
        contentHTML += `</ul>`;
    }

    if(building.description){
        if(contentHTML != `<div class="building-tippy">`)
            contentHTML += "<hr>";
        
        contentHTML += `${building.description}`;
    }

    contentHTML += `</div>`;

    return contentHTML;
}

export function destroyBuildingHTML(id, qty){
    const elements = document.querySelectorAll(".map-"+id);

    if(qty > elements.length) qty = elements.length;

    for(let i = 0; i < qty; i++){
        elements[i].remove();
    }
}

export function updateMapItemsScale(){
    const mapItems = document.querySelectorAll(".map-item").length;

    //Margins
    let mWidth = -Math.round(mapItems * 0.1);
    let mHeight = -Math.round(mapItems * 0.05);

    if(mWidth < -15) mWidth = -15;
    if(mHeight < -10) mHeight = -10;
    
    //IMG Sizes
    let modifier = Math.round(mapItems*0.15);
    if(modifier > 48) modifier = 48;

    let smSize = 48 - modifier;
    let mdSize = 64 - modifier;
    let lgSize = 72 - modifier;

    //Set CSS
    document.querySelector("#map").style.setProperty("--marginWidth", mWidth+"px");
    document.querySelector("#map").style.setProperty("--marginHeight", mHeight+"px");   
    document.querySelector("#map").style.setProperty("--sm_img_size", smSize+"px");   
    document.querySelector("#map").style.setProperty("--md_img_size", mdSize+"px");   
    document.querySelector("#map").style.setProperty("--lg_img_size", lgSize+"px");
}

const buildings = [
    ["farm",
        ["farm","cropField","orchard"]],
    ["house",
        ["shack","house","nobleHouse"]],
    ["manufacture", 
        ["dairy","mill","brickyard","sawmill"]],
    ["businesses", 
        ["bakery","tavern"]],
    ["handicraft", 
        ["tailorsmith","armory","blacksmith","barracks"]],
    ["resources", 
        ["huntingCabin","foundry","lumbermill","mine","deepMine"]],
];

let selectedBuildingMenuType = "";
function hideAllBuildingBtns(){
    for(let i = 0; i < buildings.length; i++){
        const building = buildings[i];

        document.getElementById("building-"+building[0]).classList.remove("btn-active");

        for(let j = 0; j < building[1].length; j++){
            const element = building[1][j];
            document.getElementById("add-"+element).classList.add("hidden");
        }
    }
    document.getElementById("rmv-building").classList.remove("rmv-active");
    game.destroyBuildingCheck = false;
}

export function buildinglisteners(){
    for(let i = 0; i < buildings.length; i++){
        const building = buildings[i];

        for(let j = 0; j < building[1].length; j++){
            const element = building[1][j];
            const name = buildingsData[element].name;

            document.getElementById("buildings-menu2").innerHTML += `
                <button class="btn building-menu hidden" id="add-${element}">${name}</button>
            `;
        }
        
        document.getElementById("building-"+building[0]).addEventListener("click", () => {
            if(selectedBuildingMenuType != building[0]){
                hideAllBuildingBtns();
                selectedBuildingMenuType = building[0];   
            }

            document.getElementById("building-"+building[0]).classList.add("btn-active");

            building[1].forEach(e => {
                document.getElementById("add-"+e).classList.remove("hidden");
            });
        });
    }

    document.getElementById("rmv-building").addEventListener("click", () => {
        if(game.destroyBuildingCheck){
            game.destroyBuildingCheck = false;
            document.getElementById("rmv-building").classList.remove("rmv-active");
        }else{
            game.destroyBuildingCheck = true;
            document.getElementById("rmv-building").classList.add("rmv-active");
        }
    });
}
    