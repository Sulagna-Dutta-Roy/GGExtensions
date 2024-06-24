import { rand } from "./funcs.js"

export let audio = new Audio();
const NUMBER_OF_SONGS = 7;

export function soundStart(){
    if(!localStorage.getItem("mv-volume"))
        localStorage.setItem("mv-volume", "0.5");
}

export function soundtrack(){
    if(audio.paused){
        const newSongID = rand(0,NUMBER_OF_SONGS);
        audio = new Audio("./songs/"+newSongID+".mp3");
        audio.volume = Number(localStorage.getItem("mv-volume"))/4;
        
        const tryToPlay = setInterval(() => {        
            audio.play()
            .then(() => {
                clearInterval(tryToPlay);
            })
            .catch(error => {
                ;
            });

            audio.addEventListener('ended', setTimeout(soundtrack, rand(500,4000)));

        }, 1000);
    }
}

