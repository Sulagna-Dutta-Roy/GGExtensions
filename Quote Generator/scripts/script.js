const fileP = 'https://raw.githubusercontent.com/prasad-chavan1/sci_proj/main/csvjson.json';
const newQuote = document.getElementById('newQuote');
const nameAuth = document.getElementById('nameAuth');
const quote = document.getElementById('quote');
const anime = document.getElementById('anime');
const speechBtn = document.getElementById('speechBtn');
const copyBtn = document.getElementById('copyBtn');
const whatsAppBtn = document.getElementById('whatsAppBtn');
syn = speechSynthesis;

//Reading JSON File
const request = new XMLHttpRequest();
request.open('GET', fileP);
request.send();

request.addEventListener('load', function(){
    // console.log(this.responseText);
    const data = JSON.parse(this.responseText);
    newQuote.addEventListener('click', ()=>{
        const randNum = Math.floor(Math.random()*8760) + 1;
        if(data[randNum].Quote == ''){
            quote.innerHTML = `${data[9].Quote}`;
            nameAuth.innerHTML = `${data[9].Character}`; 
            anime.innerHTML = `${data[9].Anime}`;  
        }else{
        quote.innerHTML = `${data[randNum].Quote}`;
        nameAuth.innerHTML = `${data[randNum].Character}`; 
        anime.innerHTML = `${data[randNum].Anime}`; 
        }
    });

    speechBtn.addEventListener("click", ()=>{
            let utterance = new SpeechSynthesisUtterance(`${quote.innerText} by ${nameAuth.innerText}`);
            syn.speak(utterance);
            setInterval(()=>{
                !syn.speaking ? speechBtn.classList.remove("active") : speechBtn.classList.add("active");
            }, 10);
    });

    copyBtn.addEventListener("click", ()=>{
        navigator.clipboard.writeText(quote.innerText);
    });

    whatsAppBtn.addEventListener("click", ()=>{
        var msg = `${quote.innerText} By ${nameAuth.innerText}`;
        var wpLink = `whatsapp://send?text=${msg})`;
        window.location.href = wpLink;
    });


});








