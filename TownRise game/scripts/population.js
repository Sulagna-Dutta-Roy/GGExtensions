import { popsUpdate } from "./pops.js";
import { game } from "../data/gameData.js";
import { rand } from "./funcs.js";
import { logPush } from "./ui/log.js";
import { popDeathsUI } from "./ui/ui.js";

let difficulty;

export function populationStart(){
    if(game.gameDifficulty == "hard")       difficulty = 1;
    if(game.gameDifficulty == "normal")     difficulty = 0.75;
    if(game.gameDifficulty == "easy")       difficulty = 0.5;
}

export function populationUpdate(){
    popsUpdate(difficulty);
    popGrowth();
    popDeaths();
    
    if(game.population > game.popRecord) game.popRecord = game.population;
}

export function popGrowth(){
    if(rand(0,5) != 0) return;
    
    let popGrowth = rand(0,5)+((game.lifeQuality/0.5));
    popGrowth /= 100;
    
    popGrowth = Math.round((game.population * popGrowth)*game.impacts.popGrowth);
    if(popGrowth < 1 && rand(0,Math.round(4/game.impacts.popGrowth)) == 0)
        popGrowth = 1;

    let popDeath = Math.round((game.population*(rand(0,5)/100))*game.impacts.popDeath)
    if(popDeath > game.population)
        popDeath = game.population;
    popDeath = rand(0,popDeath+1);

    game.popGrowth = popGrowth/game.population;
    game.popDeath = popDeath/game.population;

    const oldPop = game.population;
    game.population = game.population + popGrowth - popDeath;
    if(game.population > oldPop && game.population > game.popLimit) game.population = oldPop;

    if(popDeath > popGrowth){
        if(popDeath-popGrowth == 1) 
            logPush("1 cidadão morreu");
        else                        
            logPush((popDeath-popGrowth)+" cidadãos morreram");

            
        if(game.popDeaths.hasOwnProperty("natural"))
            game.popDeaths["natural"] += popDeath;
        else
            game.popDeaths["natural"] = popDeath;
    }    
}

function popDeaths(){
    hungryDeaths();
    homelessDeaths();
    cold();
    //randDeaths();
    
    function hungryDeaths(){
        if(rand(0,5) != 0) return;

        const hungry = (game.food_consumption - game.food)/game.food_consumption;
        
        if(hungry > 0){
            let popDeath = rand(1, Math.ceil(hungry * game.population));
    
            game.population -= popDeath;
    
            if(popDeath > 1)        logPush(popDeath+" cidadãos morreram de fome");
            if(popDeath == 1)       logPush(popDeath+" cidadão morreu de fome");

            if(game.popDeaths.hasOwnProperty("hungry"))
                game.popDeaths["hungry"] += popDeath;
            else
                game.popDeaths["hungry"] = popDeath;
    
            if(!game.population)    game.population = 0;
        }
    }

    function homelessDeaths(){
        if(rand(0,5) != 0) return;
        
        let homelessRate = 1;
        if(game.population)
            homelessRate = (1/(game.popLimit/game.population))-1;
        if(!homelessRate || homelessRate < 0) homelessRate = 0;

        const homelessPops = game.population-game.popLimit;

        let homelessDeathChance;
        if(game.gameDifficulty == "hard")   homelessDeathChance = 5;
        if(game.gameDifficulty == "normal") homelessDeathChance = 2.5;
        if(game.gameDifficulty == "easy")   homelessDeathChance = 1.25;

        if(game.season == "winter") homelessDeathChance *= 2
        if(game.season == "summer") homelessDeathChance *= 1.4

        if(game.weather == "rain")  homelessDeathChance *= 1.4
        if(game.weather == "snow")  homelessDeathChance *= 2

        if(game.clothes < game.population){
            const MAX_CLOTHES_DEATH_CHANCE = 2;
            
            let clothesLack = game.clothes/game.population;
            if(!clothesLack) clothesLack = 0.001;

            let clothesLackDeathChance = 1/clothesLack;
            if(clothesLack > 1) clothesLackDeathChance = 0
            if(clothesLackDeathChance > MAX_CLOTHES_DEATH_CHANCE) clothesLackDeathChance = MAX_CLOTHES_DEATH_CHANCE;

            homelessDeathChance *= clothesLackDeathChance;
        }
        
        homelessDeathChance = Math.round(homelessDeathChance);

        const popDeathChance = rand(0, 100) < homelessDeathChance;
        let popDeath = 0;

        if(popDeathChance){
            popDeath = Math.ceil((rand(0,homelessDeathChance)/100)*homelessPops);
        }

        game.population -= popDeath;

        if(popDeath > 1)    logPush(popDeath+" cidadãos morreram sem abrigo");
        if(popDeath == 1)   logPush(popDeath+" cidadão morreu sem abrigo");

        if(game.popDeaths.hasOwnProperty("homeless"))
            game.popDeaths["homeless"] += popDeath;
        else
            game.popDeaths["homeless"] = popDeath;
    }

    function cold(){
        if(rand(0,5) != 0) return;

        let popWithoutClothes = game.population - Math.floor(game.clothes);
        if(popWithoutClothes > 1) game.clothes_lack = true;

        let deathChance = 10;
        if(game.season == "winter") deathChance *= 4;
        
        let popDeath = Math.round((rand(0,deathChance)/100)*popWithoutClothes * difficulty);
        popDeath = Math.round(popDeath );

        if(popDeath < 0) popDeath = 0;

        if(game.popDeaths.hasOwnProperty("cold"))
            game.popDeaths["cold"] += popDeath;
        else
            game.popDeaths["cold"] = popDeath;

        game.population -= popDeath;
    }
}
