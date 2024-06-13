const cryptoKey = 'my-secret-key'; // Replace with a secure key

function encrypt(text) {
    return btoa(text); // Simple Base64 encoding for demonstration (use a stronger algorithm in production)
}

function decrypt(text) {
    return atob(text);
}