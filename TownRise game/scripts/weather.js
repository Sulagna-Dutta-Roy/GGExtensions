import { game } from "../data/gameData.js";
import { rand } from "./funcs.js";

export function newWeather(){
    game.weather = "sun";

    switch(game.season){
        case "spring":
            if(rand(0,100) < 40)
                game.weather = "rain";
            break;
            
        case "summer":
            if(rand(0,100) < 40)
                game.weather = "rain";
            break;

        case "autumn":
            if(rand(0,100) < 15)
                game.weather = "rain";
            break;

        case "winter":
            if(rand(0,100) < 25)
                game.weather = "snow";
            break;
    }

    let weatherIcon;
    if(game.weather == "sun")    weatherIcon = '<i class="fa-solid fa-sun"></i>';
    if(game.weather == "rain")   weatherIcon = '<i class="fa-solid fa-cloud-rain"></i>';
    if(game.weather == "snow")   weatherIcon = '<i class="fa-solid fa-snowflake"></i>';
    document.getElementById("day-weather").innerHTML = weatherIcon;
}