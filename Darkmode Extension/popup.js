function activateDarkMode() {
    document.body.classList.add('dark-mode');
    // Save the selected mode to local storage
    localStorage.setItem('mode', 'dark');
}

// Function to activate light mode
function activateLightMode() {
    document.body.classList.remove('dark-mode');
    // Save the selected mode to local storage
    localStorage.setItem('mode', 'light');
}

// Function to check and set mode on page load
function checkMode() {
    // Check if mode is stored in local storage
    const mode = localStorage.getItem('mode');
    if (mode === 'dark') {
        activateDarkMode(); // Activate dark mode if stored mode is dark
    } else {
        activateLightMode(); // Activate light mode if stored mode is not dark
    }
}

// Call checkMode function when the page loads
window.onload = checkMode;