import { game } from "../data/gameData.js"
import { popsData } from "../data/popsData.js"
import { resourceChange } from "./resources.js"

let difficulty;

export function popsUpdate(diff){
    difficulty = diff;

    foodConsumption();

    goodsConsumption();
}

function foodConsumption(){
    let variation = 0;
    const foodItems = 5;

    let grain_csmpt = 0;
    let milk_csmpt = 0;
    let meat_csmpt = 0;
    let fruit_csmpt = 0;
    let bread_csmpt = 0;

    if(game.grain > 0){
        grain_csmpt = 0.25;
        variation += 1/foodItems;
    }else{
        game.grain_lack = true;
    }
    if(game.milk > 0){
        milk_csmpt = 0.25;
        variation += 1/foodItems;
    }else{
        game.milk_lack = true;
    }   
    if(game.meat > 0){
        meat_csmpt = 0.15;
        variation += 1/foodItems;
    }else{
        game.meat_lack = true;
    }   
    if(game.fruit > 0){
        fruit_csmpt = 0.1;
        variation += 1/foodItems;
    }else{
        game.fruit_lack = true;
    }  
    if(game.bread > 0){
        bread_csmpt = 0.25;
        variation += 1/foodItems;
    }else{
        game.bread_lack = true;
    }  

    if(variation == 0)
        variation = 0.0001;

    grain_csmpt /= variation;
    milk_csmpt /= variation;
    meat_csmpt /= variation;
    fruit_csmpt /= variation;
    bread_csmpt /= variation;

    for(const p in popsData){
        game.food_consumption += popsData[p].food_consumption*game[p]*difficulty;

        const baseCsmpt = (popsData[p].food_consumption*game[p]*difficulty)/variation;

        resourceChange("consumption", "grain", "População", baseCsmpt*grain_csmpt);
        resourceChange("consumption", "milk", "População", baseCsmpt*milk_csmpt);
        resourceChange("consumption", "meat", "População", baseCsmpt*meat_csmpt);
        resourceChange("consumption", "fruit", "População", baseCsmpt*fruit_csmpt);
        resourceChange("consumption", "bread", "População", baseCsmpt*bread_csmpt);
    }
}

function goodsConsumption(){
    for(const p in popsData) {
        const pop = popsData[p];

        if(pop.hasOwnProperty("consumption")) {
            for(const goods in pop.consumption) {
                if(game.hasOwnProperty(goods+"_balance")) {
                    const popCsmpt = pop.consumption[goods]*game[p]*difficulty;
                    
                    resourceChange("consumption", goods, "População", popCsmpt);
                }
            }
        }
    }
}