let startTime, endTime;
let imageSize = "";
let speedKbs = document.getElementById("kbs");
let speedMbs = document.getElementById("mbs");
let info = document.getElementById("info");
let totalKbs, totalMbs;
let img = new Image();
let url = "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png";
const button = document.getElementById("button");


button.onclick = async () => {
    button.style.display = 'block';
    info.innerHTML = "Testing...";
    info.style.color = "blue";
    startTime = new Date().getTime();
    img.src = url;
};

img.onload = async () => {
    endTime = new Date().getTime();
    await fetch(url).then((res) => {
        imageSize = res.headers.get('content-length');
        calculateSpeed();
    });
}

function calculateSpeed(){
    let timeTaken = (endTime - startTime)/1000;
    let sizeBits = imageSize*8;
    let speedBits = (sizeBits/timeTaken);
    totalKbs = (speedBits/1024).toFixed(2);
    totalMbs = (totalKbs/1024).toFixed(2);
    
    speedKbs.innerHTML = `Speed(Kbs) : <strong>${totalKbs}</strong>`;
    speedMbs.innerHTML = `Speed(Mbs) : <strong>${totalMbs}</strong>`;    
    info.innerHTML = "~Test Completed~";
    info.style.color = "green";
    button.style.display = 'block';
}
