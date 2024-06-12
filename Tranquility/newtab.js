const messages = [
  "You are enough just as you are.",
  "Take a deep breath and relax.",
  "Peace begins with a smile.",
  "You are capable of amazing things.",
  "Stay positive, work hard, make it happen.",
  "Believe you can and you're halfway there.",
  "Every day is a second chance.",
  "Start each day with a grateful heart.",
  "You are stronger than you think.",
  "Your potential is endless."
];

function getRandomMessage() {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

document.getElementById("message").textContent = getRandomMessage();

document.getElementById("searchBox").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    const query = event.target.value;
    const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
    window.location.href = searchUrl;
  }
});
