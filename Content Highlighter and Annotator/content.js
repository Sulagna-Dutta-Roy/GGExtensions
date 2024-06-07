document.addEventListener("dblclick", () => {
  const selection = window.getSelection().toString().trim();
  if (selection) {
    const note = prompt("Add a note for the highlighted text:", "");
    if (note !== null && note !== "") {
      const range = window.getSelection().getRangeAt(0);
      const span = document.createElement("span");
      span.style.backgroundColor = "yellow";
      span.title = note;
      range.surroundContents(span);
    }
  }
});
