// Function to modify V-Bucks
function modifyVBucks() {
    let vbucks = prompt("Enter your current amount of V-Bucks:");
    vbucks = parseInt(vbucks);
    if (isNaN(vbucks)) {
      alert("Invalid number. Please try again.");
      return;
    }
    let newVBucks = 999999;
    alert(`V-Bucks modified successfully to ${newVBucks}!`);
  }
  
  // Function to unlock all skins
  function unlockAllSkins() {
    alert("All skins unlocked!");
  }
  
  // Function to unlock all emotes
  function unlockAllEmotes() {
    alert("All emotes unlocked!");
  }
  
  // Function to handle button clicks
  function handleButtonClick(event) {
    const buttonId = event.target.id;
    switch (buttonId) {
      case "modify-vbucks":
        modifyVBucks();
        break;
      case "modify-skins":
        unlockAllSkins();
        break;
      case "unlock-emotes":
        unlockAllEmotes();
        break;
      case "exit":
        alert("Exiting script...");
        break;
      default:
        break;
    }
  }
  
  // Add event listeners to buttons
  document.getElementById("modify-vbucks").addEventListener("click", handleButtonClick);
  document.getElementById("modify-skins").addEventListener("click", handleButtonClick);
  document.getElementById("unlock-emotes").addEventListener("click", handleButtonClick);
  document.getElementById("exit").addEventListener("click", handleButtonClick);
  