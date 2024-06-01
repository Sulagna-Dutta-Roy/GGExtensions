// Initialize pet stats
let happiness = 100;
let hunger = 100;

// Function to update pet stats and display
function updateStats() {
    document.getElementById('happiness').innerText = happiness;
    document.getElementById('hunger').innerText = hunger;

    let petImage = document.getElementById('pet-image');
    if (happiness >= 70) {
        petImage.src = 'assets/pet-happy.png';
    } else if (happiness >= 30) {
        petImage.src = 'assets/pet-neutral.png';
    } else {
        petImage.src = 'assets/pet-sad.png';
    }
}

// Function to feed the pet
function feedPet() {
    hunger = Math.min(hunger + 10, 100);
    happiness = Math.min(happiness + 5, 100);
    updateStats();
}

// Function to play with the pet
function playWithPet() {
    hunger = Math.max(hunger - 5, 0);
    happiness = Math.min(happiness + 10, 100);
    updateStats();
}

// Function to decrease pet stats over time
function decreaseStats() {
    hunger = Math.max(hunger - 5, 0);
    happiness = Math.max(happiness - 5, 0);
    updateStats();

    if (hunger < 10 || happiness < 10) {
        alert("Your pet needs attention!");
    }
}

// Add event listeners to buttons
document.getElementById('feed-button').addEventListener('click', feedPet);
document.getElementById('play-button').addEventListener('click', playWithPet);

// Call decreaseStats function every 4 seconds
setInterval(decreaseStats, 4000);

// Initial update of pet stats
updateStats();
