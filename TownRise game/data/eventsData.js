import { game } from "./gameData.js";
import { rand } from "../scripts/funcs.js";

export const eventsData = {
    plague: {
        rareness: (750*game.lifeQuality)+750,
        title: "Praga",
        image: true,
        message: `
            <label>Uma praga virulenta abateu-se sobre a nossa população.</label>
            <hr>
            <ul style="text-align:start;">
            Efeitos:
                <li>+200% de Mortalidade</li>
            </ul>
        `,
        onTrigger: () => {
        },
        condition: () => {
            if(game.lifeQuality >= 0.95) return false;

            return true;
        },
        duration: 360,
        modifier: "plague",
    },
    //###############################################################################################
    spring_festival: {
        rareness: 2,
        title: "Festival da Primavera",
        image: true,
        message: `
            <label>Nossa população organizou uma bela celebração.</label>
            <hr>
            <ul style="text-align:start;">
            Efeitos:
                <li>+20% de Crescimento Populacional</li>
                <li>+20% de Felicidade</li>
                <li>+40% de Produtividade das Plantações</li>
            </ul>
            `,
        onTrigger: () => {
        },
        condition: () => {
            if(game.season != "spring") return false;
            if(game.modifiers.hasOwnProperty("plague")) return false;
            if(game.modifiers.hasOwnProperty("drought")) return false;
            if(game.day%game.seasonLength == 1) return false;

            return true;
        },
        modifier: "spring_festival",
    },
    //###############################################################################################
    drought: {
        rareness: 5000,
        title: "Seca",
        image: true,
        message: `
            <label>Um período de seca começou e a fome provavelmente se seguirá à medida que as colheitas diminuírem.</label>
            <hr>
            <ul style="text-align:start;">
            Efeitos:
                <li>-60% de Produtividade das Plantações</li>
                <li>-60% de Produtividade dos Pomares</li>
            </ul>
            `,
        onTrigger: () => {
        },
        condition: () => {
            if(game.season == "winter") return false;
            if(game.modifiers.hasOwnProperty("spring_festival")) return false;

            return true;
        },
        modifier: "drought",
    },
}