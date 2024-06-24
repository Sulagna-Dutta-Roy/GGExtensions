import { game } from "../../data/gameData.js";
import { numberF } from "../funcs.js";
import { toolsAccessCalc, seasonProductivityCalc, aleAccessCalc } from "../gameTick.js";

const tooltipUpdateRate = 750;
const tooltipMaxWidth = 500;

const tippyElements = ["pop-info","productivity-info","happiness-info","food-info","score-info"];
tippyElements.forEach(e => {
    tippy("#"+e, {
        maxWidth: tooltipMaxWidth,
        allowHTML: true,
        theme: "townrise",
    });
});

setInterval(() => {
    document.querySelector("#pop-info")._tippy.setContent(`
        <p><b>População do Ano Anterior:</b> ${game.lastYear_population}</p>
        <p><b>Crescimento:</b> ${Math.round((game.population/game.lastYear_population)*100)-100}%</p>
        <br>
        <p><b>Pop. Recorde:</b> ${game.popRecord}</p>
    `);

    document.querySelector("#productivity-info")._tippy.setContent(`
        <p><b>Base:</b> 100%</p>
        <p><b>Acesso à Ferramentas:</b> ${numberF(toolsAccessCalc()*100,"",0)}%</p>
        <p><b>Estação do Ano:</b> ${numberF(seasonProductivityCalc()*100,"",0)}%</p>
    `);

    document.querySelector("#happiness-info")._tippy.setContent(`
        <p><b>Base:</b> 100%</p>
        <p><b>Acesso à Cerveja:</b> ${numberF(aleAccessCalc()*100,"",0)}%</p>
        <p><b>Impactos na Felicidade.:</b> ${numberF(Math.round(game.impacts.happiness*100)-100,"balance",0)}%</p>
    `);

    document.querySelector("#food-info")._tippy.setContent(`
        <p><b>Consumo Diário:</b> ${numberF(game.food_consumption,"",1)}</p>
        <p><b>Estoque aproximado para:</b> ${numberF(game.food/game.food_consumption,"",0)} dias</p>
    `);

    const paramsSum = game.popRecord + (1+game.weapon) + game.totalDays + game.happiness;
    document.querySelector("#score-info")._tippy.setContent(`
        <p><b>Armas:</b> ${numberF(((1+game.weapon)/paramsSum)*game.score,"",0)} pts</p>
        <p><b>Dias Totais:</b> ${numberF((game.totalDays/paramsSum)*game.score,"",0)} pts</p>
        <p><b>Felicidade:</b> ${numberF((game.happiness/paramsSum)*game.score,"",0)} pts</p>
        <p><b>População Recorde:</b> ${numberF((game.popRecord/paramsSum)*game.score,"",0)} pts</p>
    `);
},tooltipUpdateRate);