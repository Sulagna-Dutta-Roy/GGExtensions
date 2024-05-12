fetch('https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Pun,Christmas?blacklistFlags=nsfw&type=single#')
.then(data => data.json())
.then(jokedata =>{
    const joketext = jokedata.joke;
    const JokeElement = document.getElementById("JokeElement");

    JokeElement.innerHTML=joketext;
})