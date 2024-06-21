import { game } from "../data/gameData.js";
import { logPush } from "./ui/log.js";
import { buildingsUpdate } from "./buildings.js";
import { rand, average } from "./funcs.js";
import { updateDataInfo } from "./ui/ui.js";
import { resources } from "../data/resourcesData.js";
import { populationUpdate } from "./population.js";
import { events } from "./events.js";

export function gameTick(){
    if(game.gameOver) return;

    // RESET RESOURCES BALANCES
    for(const r in resources){
        resetResource(r);
    }
    game.food_consumption = 0;
    game.popLimit = 10;

    buildingsUpdate();
    populationUpdate();

    scoreCalc();
    productivityCalc();
    balanceCalc();
    resourcesCalc();
    happinessCalc();
    foodCalc();

    updateDataInfo();
    
    // RESET IMPACTS VARS
    for(const k in game.impacts) {
        game.impacts[k] = 1;
    }

    events();
}

function balanceCalc(){
    for(const r in resources){
        let production = 0;
        let consumption = 0;

        for(const p in game[r+"_production"]){
            production += game[r+"_production"][p];
        }
        for(const c in game[r+"_consumption"]){
            consumption += game[r+"_consumption"][c];
        }

        game[r+"_totalProduction"] = production;
        game[r+"_totalConsumption"] = consumption;
        game[r+"_balance"] = production-consumption;
    }
}

function resourcesCalc(){
    for(const r in resources){
        //Add to Resource Count the Balance
        game[r] += game[r+"_balance"];

        //If Resource Count < 0 set to 0
        if(game[r] < 0){
            game[r] = 0;

            if(game[r+"_balance"] < 0)
                game[r+"_lack"] = true;
        }
    }
}

export function resetResource(resource){
    game[resource+"_production"] = {};
    game[resource+"_consumption"] = {};
    game[resource+"_totalProduction"] = 0;
    game[resource+"_totalConsumption"] = 0;
    game[resource+"_balance"] = 0;
    game[resource+"_lack"] = false;
}

export function toolsAccessCalc(){
    let toolsAccess = game.tools/game.population;
    if(game.tools == 0) toolsAccess = 0;
    if(toolsAccess > 1) toolsAccess = 1;
    if(toolsAccess < 1) game.tools_lack = true;

    return toolsAccess;
}

export function aleAccessCalc(){
    let aleAccess = game.ale/game.population;
    if(game.ale == 0) aleAccess = 0;
    if(aleAccess > 1) aleAccess = 1;
    if(aleAccess < 1) game.ale_lack = true;

    return aleAccess;
}

export function seasonProductivityCalc(){
    let seasonProductivity = 1;
    
    if(game.season == "winter")     seasonProductivity *= 0.5;

    return seasonProductivity;
}

export function productivityCalc(){
    game.productivity = average([1, toolsAccessCalc(), seasonProductivityCalc()]);

    if(game.productivity > 1) game.productivity = 1;
    if(game.gameDifficulty == "normal" && game.productivity < 0.25) game.productivity = 0.25;
    if(game.gameDifficulty == "easy" && game.productivity < 0.5) game.productivity = 0.5;
}

export function happinessCalc(){
    game.happiness = average([1,aleAccessCalc(),game.lifeQuality]);

    game.happiness *= game.impacts.happiness

    if(game.happiness > 1) game.happiness = 1;
    if(game.happiness < 0) game.happiness = 0;
}

export function foodCalc(){
    game.food = (game.grain*0.25) + (game.meat*0.15) + (game.fruit*0.1) + (game.bread*0.25) + (game.milk*0.25);
}

function scoreCalc(){
    let difficultyBonus = 1;
    if(game.gameDifficulty == "hard") difficultyBonus *= 2;
    if(game.gameDifficulty == "easy") difficultyBonus /= 10;

    game.score = Math.floor(((game.popRecord * (1+game.weapon) * game.totalDays * game.happiness)/2000)*difficultyBonus);
}