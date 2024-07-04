document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("keypress", function (event) {
    playSound(event.key);
  });

  button.addEventListener("click", function () {
    var buttonInnerHTML = this.getAttribute("id");
    playSound(buttonInnerHTML);
  });
});

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}
