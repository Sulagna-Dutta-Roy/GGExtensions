import { game } from "../../data/gameData.js";
import { audio } from "../sound.js";

export function gameOptionsUI(){
    const volumeValue = localStorage.getItem("mv-volume");
    
    Swal.fire({
        title: "<strong>Opções do Jogo</strong>",
        html: `
        <div id="game-options">
            <div class="container" id="volume">
                <input type="range" min="0" max="1" value="${volumeValue}" step="0.05">
                <p>Volume</p>
            </div>
        </div>
        `,
        display: "flex",
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: "Ok",
      });

      const volumeEl = document.querySelector("#volume input");
      volumeEl.addEventListener("change", () => {
          localStorage.setItem("mv-volume", volumeEl.value);
          audio.volume = volumeEl.value;
      });
}

export async function selectGameDifficultyUI(){
    const inputOptions = new Promise((resolve) => {
        resolve({
            "easy": "Fácil",
            "normal": "Normal",
            "hard": "Difícil"
        })
    })
    
    const { value: difficulty } = await Swal.fire({
        title: "Dificuldade",
        input: "radio",
        allowOutsideClick: false,
        allowEscapeKey: false,
        inputOptions: inputOptions,
        inputValidator: (value) => {
            if(!value) return "Você precisa escolher uma dificuldade";
        }
    });
    
    if(difficulty == "easy")    game.gameDifficulty = "easy";
    if(difficulty == "normal")  game.gameDifficulty = "normal";
    if(difficulty == "hard")    game.gameDifficulty = "hard";
}