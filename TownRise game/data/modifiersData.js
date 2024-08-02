import { game } from "./gameData.js";
import { rand } from "../scripts/funcs.js";

export const modifiersData = {
    plague: {
        name: "Praga",
        duration: 360,
        description: [
            "+200% de Mortalidade",
        ],
        effect: () => {
            game.impacts.popDeath *= 4;
        },
    },
    spring_festival: {
        name: "Festival da Primavera",
        duration: 90,
        description: [
            "+20% de Crescimento Populacional",
            "+20% de Felicidade",
            "+40% de Produtividade das Plantações",
        ],
        effect: () => {
            game.impacts.popGrowth *= 1.2;
            game.impacts.happiness *= 1.2;
            game.impacts.cropField_productivity *= 1.4;
        },
    },
    drought: {
        name: "Seca",
        duration: rand(1,6)*90,
        description: [
            "-60% de Produtividade das Plantações",
            "-60% de Produtividade dos Pomares",
        ],
        effect: () => {
            game.impacts.cropField_productivity *= 0.6;
            game.impacts.orchard_productivity *= 0.6;
        },
    },
}