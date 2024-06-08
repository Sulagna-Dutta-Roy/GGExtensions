(function () {
  document.body.style.backgroundColor = "#f4f4f4";
  document.body.style.color = "#333";
  document.body.style.margin = "0";
  document.body.style.padding = "20px";

  const elementsToHide = [
    "header",
    "nav",
    "aside",
    "footer",
    ".sidebar",
    ".ad",
    ".popup",
  ];
  elementsToHide.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      el.classList.add("reading-mode");
      el.style.display = "none";
    });
  });
})();
