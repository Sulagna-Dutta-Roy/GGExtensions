export function savedGamesHTML(){
    let villages = localStorage.getItem("mv-saved-villages");

    if(villages == null ||villages == "null" || villages == "[]" || villages.length == 0){
        document.getElementById("load-village").classList.add("hidden");
        document.getElementById("saved-villages").style.display = "none";
        return;
    }

    villages = JSON.parse(villages);
    let html;

    for(let i = 0; i < villages.length; i++){
        html += `<option value="${villages[i].villageName}">${villages[i].villageName}</option>`;
    }

    document.getElementById("village-to-load").innerHTML = html;
}