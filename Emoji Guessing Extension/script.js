const emojiTextElement = document.getElementById('emoji-text');
const emojiMeaningElement = document.getElementById('emoji-meaning');
const copyButton = document.getElementById('copy-button');

let emojis = localStorage.getItem('emojis') ? JSON.parse(localStorage.getItem('emojis')) : {};

chrome.runtime.onMessage.addListener((message) => {
    if (message.emoji) {
        emojiTextElement.textContent = message.emoji;
        if (emojis[message.emoji]) {
            emojiMeaningElement.textContent = emojis[message.emoji];
        } else {
            fetch(`https://api.emojidex.com/v2/emojis/${message.emoji}`) // Replace with your API
                .then(response => response.json())
                .then(data => {
                    emojis[message.emoji] = data.meanings[0];
                    localStorage.setItem('emojis', JSON.stringify(emojis));
                    emojiMeaningElement.textContent = data.meanings[0];
                })
                .catch(error => emojiMeaningElement.textContent = 'Oops! Could not find meaning.');
