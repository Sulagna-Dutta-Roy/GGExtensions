import { buildingsData } from "../../data/buildingsData.js";
import { game } from "../../data/gameData.js"

export function homes(){
    shack();
    house();
    nobleHouse();
}

function shack(){
    let woodSupply = 1;
    if(game.season == "winter" && game.wood_lack) woodSupply = 0.25;

    game.popLimit += buildingsData["shack"].popLimit * game["shack"] * woodSupply;
}

function house(){
    let woodSupply = 1;
    if(game.season == "winter" && game.wood_lack) woodSupply = 0.5;

    game.popLimit += buildingsData["house"].popLimit * game["house"] * woodSupply;
}

function nobleHouse(){
    let woodSupply = 1;
    if(game.season == "winter" && game.wood_lack) woodSupply = 0.75;

    game.popLimit += buildingsData["nobleHouse"].popLimit * game["nobleHouse"] * woodSupply;
}