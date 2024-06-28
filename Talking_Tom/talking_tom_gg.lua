// This script is for educational purposes only

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

// Main menu
function mainMenu() {
  const menu = prompt("Select an option:\n1. Modify Coins\n2. Modify Diamonds\n3. Unlock All Items\n4. Exit");
  const choice = parseInt(menu);

  switch (choice) {
    case 1:
      modifyCoins();
      break;
    case 2:
      modifyDiamonds();
      break;
    case 3:
      unlockAllItems();
      break;
    case 4:
      alert("Exiting script...");
      break;
    default:
      alert("Invalid choice. Please try again.");
      mainMenu();
      break;
  }
}

// Run the main menu function
mainMenu();
