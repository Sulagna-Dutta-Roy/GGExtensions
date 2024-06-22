import { rand } from "../funcs.js";
import { game } from "../../data/gameData.js";

export function popUpdate(){
    return;
    if(game.gamePaused) return;
    if(!game.gameStarted) return;

    const popCount = document.querySelectorAll(".pop").length;

    if(game.population > popCount){
        const diff = game.population-popCount;

        for(let i = 0; i < diff; i++) {
            addPop(false);
        }
    }
    if(game.population < popCount){
        const diff = popCount-game.population-1;

        removePop();
    }
}

export function popBootstrap(){
    for(let i = 0; i < game.population; i++){
        addPop(true);
    }
}

function addPop(isBootstrap){
    return;
    let sprite;

    if(isBootstrap)
        sprite = `<img class="pop pop-live"`;
    else
        sprite = `<img class="pop"`;

    const popVariation = rand(0,2);
    sprite += `src="./img/pop${popVariation}.png" >`

    document.getElementById("pops").innerHTML += sprite;

    setTimeout(()=> {
        for(let i = 0; i < document.querySelectorAll(".pop").length; i++){
            const element = document.querySelectorAll(".pop")[i];

            if(element.classList.contains("pop") && !element.classList.contains("pop-die")){
                element.classList.add("pop-live");
            }
        }
    }
    ,250);
}

function removePop(){
    return;
    document.querySelectorAll(".pop")[document.querySelectorAll(".pop").length-1].classList.add("pop-die");

    setTimeout(()=> {
        for(let i = 0; i < document.querySelectorAll(".pop-die").length; i++){
            const element = document.querySelectorAll(".pop-die")[i];

            element.remove();
        }
    }
    ,1000);
}

