document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("gameBoard");
    const rows = 5;
    const cols = 5;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const hex = document.createElement("div");
            hex.className = "hex";
            hex.addEventListener("click", () => {
                hex.classList.toggle("clicked");
            });
            gameBoard.appendChild(hex);
        }
    }
});
