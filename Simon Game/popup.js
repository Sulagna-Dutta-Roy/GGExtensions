const user = document.querySelectorAll(".box");
const tr = document.querySelector(".box2");
const bl = document.querySelector(".box3");
const tl = document.querySelector(".box1");
const br = document.querySelector(".box4");
let h2 = document.querySelector("h2");
let loader=document.getElementById("preloader");
    window.addEventListener("load",function(){
     loader.style.display="none";
  })
const color = [tl, tr, bl, br];
let seq;
let ip;
let level;
let gamestart = false;
let audio = new Audio("wrong btn.mp3");
let audioseq = new Audio("btn Flash.mp3");
let start = document.querySelector(".start_btn");
let reset = document.querySelector(".reset_btn");
let isListening = false;
audio.load();
audioseq.load();

start.addEventListener("click", () => {
  gamestart = true;
  if (gamestart) {
    seq = [];
    ip = [];
    level = 0;
    levelup();
    start.style.display = "None";
    reset.style.display = "block";
    document.querySelector("body").style.backgroundColor = "#A7E6FF";
  }
});
function btnFlash(btn) {
  btn.classList.add("flash");

  setTimeout(function () {
    btn.classList.remove("flash");
  }, 800);
}
function levelup() {
  ip = [];
  level++;
  h2.innerText = `Level ${level}`;
  nextstep();
  for (let i = 0; i < seq.length; i++) {
    setTimeout(() => {
      console.log(seq[i]);
      btnFlash(seq[i]);
      audioseq.play();
    }, 0.5);
  }
  isListening = true;
  userinput();
}
function check(indx) {
  if (seq[indx] === ip[indx]) {
    if (seq.length === ip.length) {
      setTimeout(() => {
        levelup();
      }, 1000);
    }
  } else {
    audio.play();
    h2.innerText = `Game Over! Your score was ${level}`;
    document.querySelector("body").style.backgroundColor = "red";
  }
}
function userFlash(btn) {
  btn.classList.add("userFlash");
  setTimeout(() => {
    btn.classList.remove("userFlash");
  }, 80);
}
function userinput() {
  for (btn of user) {
    btn.addEventListener("click", handleclick);
  }
}
function handleclick() {
  if (!isListening) return;
  else {
    userFlash(this);
    ip.push(this);
    check(ip.length - 1);
  }
}
function nextstep() {
  seq.push(color[Math.floor(Math.random() * 4)]);
}

reset.addEventListener("click", () => {
  seq = [];
  ip = [];
  level = 0;
  gamestart = false;
  h2.innerText = `Level ${level}`;
  start.style.display = "block";
  reset.style.display = "None";
  document.querySelector("body").style.backgroundColor = "#A7E6FF";
});
