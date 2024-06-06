let coin = document.querySelector(".coin");
let flipBtn = document.querySelector("#flip-button");

const audio = new Audio();
audio.src = "sounds/coin-flip.mp3"

flipBtn.addEventListener("click", () => {
  let i = Math.floor(Math.random() * 2);
  //it will give i as 0 and 1
  coin.style.animation = "none";
  if (i) {
    setTimeout(function () {
      coin.style.animation = "spin-heads 3s forwards";
    }, 100);
  } else {
    setTimeout(function () {
      coin.style.animation = "spin-tails 3s forwards";
    }, 100);
  }
  audio.play();
  disableBtn();
});

function disableBtn() {
  flipBtn.disabled = true;
  setTimeout(() => {
    flipBtn.disabled = false;
  }, 3000);
}
