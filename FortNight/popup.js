// This script is for educational purposes only

// Function to modify health
function modifyHealth() {
  let health = prompt("Enter your current amount of health:");
  health = parseInt(health);
  if (isNaN(health)) {
    alert("Invalid number. Please try again.");
    return;
  }
  let newHealth = 999;
  alert(`Health modified successfully to ${newHealth}!`);
}

// Function to modify shield
function modifyShield() {
  let shield = prompt("Enter your current amount of shield:");
  shield = parseInt(shield);
  if (isNaN(shield)) {
    alert("Invalid number. Please try again.");
    return;
  }
  let newShield = 999;
  alert(`Shield modified successfully to ${newShield}!`);
}

// Function to modify ammo
function modifyAmmo() {
  let ammo = prompt("Enter your current amount of ammo:");
  ammo = parseInt(ammo);
  if (isNaN(ammo)) {
    alert("Invalid number. Please try again.");
    return;
  }
  let newAmmo = 999;
  alert(`Ammo modified successfully to ${newAmmo}!`);
}

// Main menu
function mainMenu() {
  const menu = prompt("Select an option:\n1. Modify Health\n2. Modify Shield\n3. Modify Ammo\n4. Exit");
  const choice = parseInt(menu);

  switch (choice) {
    case 1:
      modifyHealth();
      break;
    case 2:
      modifyShield();
      break;
    case 3:
      modifyAmmo();
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
