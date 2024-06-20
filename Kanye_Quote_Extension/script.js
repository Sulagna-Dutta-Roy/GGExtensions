document.querySelector('button').addEventListener('click',kanyeQuotes)
let value;
async function kanyeQuotes(){
    try {
        const response = await fetch('https://api.kanye.rest/')
        const data = await response.json()
        console.log(data.quote)
        value = JSON.stringify(data.quote)
        const display = document.querySelector('#quote')
        display.innerHTML = `<h1>${value}</h1`
    } catch (error) {
        console.log('err',error)
    }
    
}