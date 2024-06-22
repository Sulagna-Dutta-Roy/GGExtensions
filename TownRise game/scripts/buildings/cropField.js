import { game } from "../../data/gameData.js"

export function cropField(){
    let weatherProductivity = 1;

    if(game.weather == "rain") weatherProductivity *= 4;
    if(game.season == "winter") weatherProductivity *= 0;

    game.impacts["cropField_productivity"] *= weatherProductivity;
}

