document.addEventListener("DOMContentLoaded", function () {  const treesContainer = document.getElementById("trees");
  const plantTreeButton = document.getElementById("plantTree");
  const growthTimeInput = document.getElementById("growthTime");

  plantTreeButton.addEventListener("click", function () {
    const tree = document.createElement("img");
    tree.src = "tree.png"; // Replace 'tree.png' with the path to your tree image
    tree.classList.add("tree");
    treesContainer.appendChild(tree);

    const growthTime = parseInt(growthTimeInput.value) * 1000; // Convert seconds to milliseconds

    // Simulate tree growth
    setTimeout(() => {
      tree.src = "tree_dead.png"; // Optionally, change the tree image when it's dead
    }, growthTime);
  });
});
