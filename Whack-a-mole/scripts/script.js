const score = document.querySelector(".score span");
const holes = document.querySelectorAll(".hole");
const playBtn = document.querySelector(".play");
const stopBtn = document.querySelector(".stop");
const cursor = document.querySelector(".cursor img");

window.addEventListener("mousemove", (e) => {
    console.log("moving")
    cursor.style.top = e.pageY-100 + "px";
    let consider=0
    let additional=0
    if(window.innerWidth>621){
     consider=(window.innerWidth-621)/10
     if(window.innerWidth>1501){
        additional=(window.innerWidth-1501)/10
        additional=(additional*2)+70
     }

    }
    console.log(additional)
    cursor.style.right= window.innerWidth-e.pageX - (e.pageX/100)*50.6 -consider*4 + additional + "px";
    window.addEventListener("click", () => {
        cursor.style.animation = "hit 0.1s ease";
        setTimeout(() => {
            cursor.style.removeProperty("animation");
        }, 100);
    });
});

playBtn.addEventListener("click", () => {
    playBtn.style.display = "none";
    stopBtn.style.display = "inline-block";

    let hole;
    let points = 0;

    const startGame = setInterval(() => {
        let arrayNo = Math.floor(Math.random() * 9);
        hole = holes[arrayNo];

        let image = document.createElement("img");
        image.setAttribute("src", "assets/Mole.png");
        image.setAttribute("class", "mole");
        hole.appendChild(image);

        setTimeout(() => {
            hole.removeChild(image);
        }, 600);
    }, 700);

    window.addEventListener("click", (e) => {
        if (e.target === hole) score.innerText = ++points;
    });

    stopBtn.addEventListener("click", () => {
        clearInterval(startGame);
        stopBtn.style.display = "none";
        playBtn.style.display = "inline-block";
        score.innerText = 0;
    });
});