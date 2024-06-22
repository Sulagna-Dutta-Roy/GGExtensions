import { resources } from "../../data/resourcesData.js"
import { popsData } from "../../data/popsData.js"
import { numberF, numberBalanceFormatted, translateSeason } from "../funcs.js"
import { game } from "../../data/gameData.js"
import { modifiersData } from "../../data/modifiersData.js";
import { buildingsDescriptionUpdate } from "./buildingsUI.js";

export function resourcesUI(){
    const element = document.getElementById("resources");
    let html = "";

    let res = {
        special: ["Especial"],
        food: ["Alimentos"],
        rawFood: ["Alimentos Brutos"],
        beverage: ["Bebidas"],
        rawMaterial: ["Matérias Primas"],
        refinedMaterial: ["Materiais Refinados"],
        endProduct: ["Produtos"],
        luxury: ["Luxos"],
    }

    for(const r in resources){
        if(resources[r].type == "special")             res.special.push(r);
        if(resources[r].type == "food")                res.food.push(r);
        if(resources[r].type == "raw food")            res.rawFood.push(r);
        if(resources[r].type == "beverage")            res.beverage.push(r);
        if(resources[r].type == "raw material")        res.rawMaterial.push(r);
        if(resources[r].type == "refined material")    res.refinedMaterial.push(r);
        if(resources[r].type == "end product")         res.endProduct.push(r);
        if(resources[r].type == "luxury")              res.luxury.push(r);
    }
    
    for(const t in res){
        const type = res[t];

        html += `<div class="resources-row">`;

        if(type.length > 1)
            html += `<p id="resource-type-${t}">${type[0]}</p>`;

        for(let j = 1; j < type.length; j++){
            const r = type[j];

            html += `
            <div class="resources-btn" id="${r}">
                <img id="${r}-img" src="./img/icons/${r}.png" draggable="false">
                <p id="${r}-stat"></p>
                <small id="${r}-balance-stat">0</small>
            </div>
            `
        }
        html += "</div>";
        element.innerHTML = html;
    }

    const resourcesTypeDesc = {
        special: "Produtos especiais",
        food: "Alimentos consumidos pela população",
        rawFood: "Alimentos que não serão consumidos diretamente, mas são necessários na cadeia de produção",
        beverage: "Bebidas consumidas pela população, mas que não são necessariamente alimentos",
        rawMaterial: "Recursos mais básicos",
        refinedMaterial: "Recursos refinados de matérias primas, que podem ter uso diretamente ou podem se encaixar em alguma cadeia de produção",
        endProduct: "Produtos do fim da cadeia de produção",
        luxury: "Produtos de alto valor agregado, que trazem prestígio",
    }

    for(const r in resourcesTypeDesc){
        tippy("#resource-type-"+r, {
            content: resourcesTypeDesc[r],
            theme: "townrise",
        });
    }

    for(const r in resources){
        tippy("#"+r, {
            allowHTML: true,
            theme: "townrise",
        });
    }
}

export function professionsUI(){
    let html = `
    <table>
        <tr>
            <td><img src="./img/icons/idle.png" draggable="false"></td>
            <td><p>Ocioso:</p></td>
            <td></td>
            <td><p><span id="idle-stat">10</span></p></td>
        </tr>
    `;

    for(const p in popsData){
        if(p == "idle") continue;

        html += `
            <tr>
                <td><img src="./img/icons/${p}.png" draggable="false"></td>
                <td><p>${popsData[p].name}:</p></td>
                <td><input id="${p}-input" class="professions-slider" type="range" value="0" step="1"></td>
                <td><p><span id="${p}-stat">10</span>/<span id="${p}-jobs-stat">10</span></p></td>
            </tr>
        `;
    }

    html += "</table>"

    document.getElementById("pops").innerHTML = html;
}

export function updateDataInfo(){
    const statsElements = ["totalDays","day","year","population","popLimit","food","knowledge"];
    statsElements.forEach(e => {
        document.getElementById(e+"-stat").innerText = numberF(game[e],"",0);
    });

    document.getElementById("season").innerText = translateSeason(game.season);
    document.getElementById("score-stat").innerText = numberF(game.score,"",0);

    resourcesStatAndLack();
    professionsStat();

    buildingsDescriptionUpdate();

    modifiersUI();
    popDeathsUI();

    //Bars
    const barsElements = ["productivity","happiness","lifeQuality"];
    barsElements.forEach(e => {
        document.getElementById(e+"-bar").style.width = Math.round(game[e]*100).toString()+"%";
        document.getElementById(e+"-stat").innerText = numberF(game[e]*100,"",0);
    });
}

export function modifiersUI(){
    function createTippy(id){
        let desc = "<h4>"+modifiersData[id].name+"</h4>";
        modifiersData[id].description.forEach(e => {
            desc += `<p>${e}</p>`;
        });

        tippy("#"+id+"-modifier", {
            content: desc,
            allowHTML: true,
            theme: "townrise",
        });
    }
    function createModElement(id){
        document.getElementById("active-modifiers").innerHTML += `
            <div class="container modifier-icon" id="${id}-modifier">
                <img src="./img/icons/modifiers/${id}.png" draggable="false">
                <small>${game.modifiers[id]}</small>
            </div>
        `;

        createTippy(id);
    }
    function updateModElement(id){
        document.querySelector("#"+id+"-modifier small").innerText = game.modifiers[id];
    }
    function deleteModElement(id){
        document.getElementById(id+"-modifier").remove();
    }
    //###############################################################3

    for(const m in game.modifiers){
        if(document.getElementById(m+"-modifier") == null){
            createModElement(m);
        }
        else{
            updateModElement(m);
        }
    }

    for(const m in game.modifiers){
        if(document.getElementById(m+"-modifier")._tippy == undefined)
            createTippy(m);
    }

    document.querySelectorAll(".modifier-icon").forEach(e => {
        const elID = e.id.slice(0, -"-modifier".length);
        
        if(!game.modifiers.hasOwnProperty(elID)){
            deleteModElement(elID);
        }
    });
}

const deathData = {
    natural: {
        article: "de ",
        name: "Morte Natural",
    },
    hungry: {
        article: "de ",
        name: "Fome",
    },
    homeless: {
        article: "",
        name: "Sem Abrigo",
    },
    cold: {
        article: "de ",
        name: "Frio",
    },
}

export function popDeathsUI(){
    function createTippy(id){
        tippy("#"+id+"-pop-death", {
            content: "<p>Mortos <b>"+deathData[id].article+deathData[id].name+"</b></p>",
            allowHTML: true,
            theme: "townrise",
            interactive: false,
        });
    }
    function createModElement(id){
        document.getElementById("pop-deaths").innerHTML += `
            <div class="container pop-death-icon" id="${id}-pop-death">
                <img src="./img/icons/pop-deaths/${id}.png" draggable="false">
                <small>${game.popDeaths[id]}</small>
            </div>
        `;

        createTippy(id);
    }
    function updateModElement(id){
        document.querySelector("#"+id+"-pop-death small").innerText = game.popDeaths[id];
    }
    function deleteModElement(id){
        document.getElementById(id+"-pop-death").remove();
    }
    //###############################################################

    for(const m in game.popDeaths){
        if(document.getElementById(m+"-pop-death") == null){
            createModElement(m);
        }
        else{
            updateModElement(m);
        }
    }

    for(const m in game.popDeaths){
        if(document.getElementById(m+"-pop-death")._tippy == undefined)
            createTippy(m);
    }

    document.querySelectorAll(".pop-death-icon").forEach(e => {
        const id = e.id.slice(0, -"-pop-death".length);

        if(!game.popDeaths.hasOwnProperty(id) || game.popDeaths[id] == 0){
            deleteModElement(id);
            delete game.popDeaths[id];
        }
    });
}

function resourcesStatAndLack(){
    for(const r in resources){
        document.getElementById(r+"-stat").innerText = numberF(Math.floor(game[r]),"",0);
        document.getElementById(r+"-balance-stat").innerText = numberBalanceFormatted(game[r+"_balance"]);

        if(game[r+"_lack"])
            document.getElementById(r+"-stat").classList.add("lack");
        else
            document.getElementById(r+"-stat").classList.remove("lack");
        
        let balanceContent = `<h1>${resources[r].name}</h1>`;
        balanceContent += `<b>Produção: ${numberF(game[r+"_totalProduction"],"",1)}</b>`;
        for(const p in game[r+"_production"]){
            const prod = numberF(game[r+"_production"][p],"",1);
            balanceContent += `<p>${p}: ${prod}</p>`
        }
        balanceContent += `<hr><b>Consumo: ${numberF(-game[r+"_totalConsumption"],"",1)}</b>`;
        for(const c in game[r+"_consumption"]){
            const cons = numberF(-game[r+"_consumption"][c],"",1);
            balanceContent += `<p>${c}: ${cons}</p>`
        }
        document.querySelector("#"+r)._tippy.setContent(balanceContent);
    }    
}

function professionsStat(){
    game.idle = game.population;
    for(const j in popsData){     
        if(j == "idle") continue;
           
        game[j] = Number(document.getElementById(j+"-input").value);

        game.idle -= game[j];
    }

    for(const j in popsData){
        if(j == "idle") continue;

        if(game[j+"_jobs"] == 0)   
            document.getElementById(j+"-input").disabled = true;
        else
            document.getElementById(j+"-input").disabled = false;

        document.getElementById(j+"-input").value = game[j];
        document.getElementById(j+"-input").max = (game.idle+game[j])<game[j+"_jobs"]?(game.idle+game[j]):game[j+"_jobs"];
        document.getElementById(j+"-stat").innerText = game[j];
        document.getElementById(j+"-jobs-stat").innerText = game[j+"_jobs"];
    }

    if(game.idle < 0) game.idle = 0;
    document.getElementById("idle-stat").innerText = game.idle;
}