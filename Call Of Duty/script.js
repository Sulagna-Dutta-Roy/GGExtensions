// Function to modify coins
function modifyCoins() {
    let coins = prompt("Enter your current amount of coins:");
    coins = parseInt(coins);
    if (isNaN(coins)) {
      alert("Invalid number. Please try again.");
      return;
    }
    let newCoins = 999999;
    alert(`Coins modified successfully to ${newCoins}!`);
  }
  
  // Function to modify diamonds
  function modifyDiamonds() {
    let diamonds = prompt("Enter your current amount of diamonds:");
    diamonds = parseInt(diamonds);
    if (isNaN(diamonds)) {
      alert("Invalid number. Please try again.");
      return;
    }
    let newDiamonds = 9999;
    alert(`Diamonds modified successfully to ${newDiamonds}!`);
  }
  
  // Function to unlock all items
  function unlockAllItems() {
    alert("All items unlocked!");
  }
  
  // Function to handle button clicks
  function handleButtonClick(event) {
    const buttonId = event.target.id;
    switch (buttonId) {
      case "modify-coins":
        modifyCoins();
        break;
      case "modify-diamonds":
        modifyDiamonds();
        break;
      case "unlock-items":
        unlockAllItems();
        break;
      case "exit":
        alert("Exiting script...");
        break;
      default:
        break;
    }
  }
  
  // Add event listeners to buttons
  document.getElementById("modify-coins").addEventListener("click", handleButtonClick);
  document.getElementById("modify-diamonds").addEventListener("click", handleButtonClick);
  document.getElementById("unlock-items").addEventListener("click", handleButtonClick);
  document.getElementById("exit").addEventListener("click", handleButtonClick);
  