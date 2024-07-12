// Assuming .Btn is the class for the button you want to attach the event to
let mybutton = document.querySelector(".back-to-top-btn");

document.addEventListener("DOMContentLoaded", (event) => {
  if (mybutton) {
    mybutton.addEventListener("click", topFunction);
  }

  window.onscroll = function () {
    scrollFunction();
  };
});

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "flex";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
