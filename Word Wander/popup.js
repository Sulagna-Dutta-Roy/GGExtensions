const words = [
    "Believe in yourself!",
    "Stay positive and focused.",
    "Every moment is a fresh beginning.",
    "Dream big and work hard.",
    "You are capable of amazing things.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
    "In the middle of every difficulty lies opportunity. - Albert Einstein",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Success is walking from failure to failure with no loss of enthusiasm. - Winston Churchill",
    "The best way to predict the future is to create it. - Abraham Lincoln",
    "It does not matter how slowly you go as long as you do not stop. - Confucius",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Opportunities don't happen, you create them. - Chris Grosser",
    "The secret of getting ahead is getting started. - Mark Twain",
    "You miss 100% of the shots you don't take. - Wayne Gretzky",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Success is not in what you have, but who you are. - Bo Bennett",
    "The best preparation for tomorrow is doing your best today. - H. Jackson Brown Jr.",
    "It always seems impossible until it's done. - Nelson Mandela",
    "Act as if what you do makes a difference. It does. - William James"
];

function generateRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    document.getElementById("wordDisplay").textContent = randomWord;
}

document.getElementById("generateBtn").addEventListener("click", generateRandomWord);
