import { game } from "../../data/gameData.js"

export function orchard(){
    let weatherProductivity = 1;

    if(game.season == "winter") weatherProductivity *= 0;

    game.impacts["orchard_productivity"] *= weatherProductivity;
}

