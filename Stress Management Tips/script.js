// script.js

const tips = [
    "Take a deep breath. Inhale slowly through your nose, hold for a few seconds, and exhale through your mouth.",
    "Try a quick meditation. Close your eyes and focus on your breathing for 5 minutes.",
    "Practice progressive muscle relaxation. Tense and then relax each muscle group in your body, starting from your toes up to your head.",
    "Go for a short walk. Physical activity can help clear your mind and reduce stress.",
    "Listen to calming music or nature sounds. Let the soothing sounds help you relax.",
    "Write down your thoughts. Journaling can help you process your feelings and reduce stress.",
    "Take a break from screens. Spend a few minutes away from your phone or computer to rest your eyes and mind.",
    "Practice gratitude. Think of three things you're grateful for and write them down.",
    "Stretch your body. Gentle stretching can relieve tension and improve your mood.",
    "Drink a glass of water. Staying hydrated is important for your overall well-being.",
    "Read a book or a favorite article. Reading can be a great escape and help you relax.",
    "Try aromatherapy. Use essential oils like lavender or eucalyptus to create a calming atmosphere.",
    "Spend time with a pet. If you have a pet, spending time with them can reduce stress.",
    "Disconnect from social media. Take a break from social media to focus on the present moment.",
    "Do something creative. Engage in a hobby like drawing, painting, or crafting to relax."
];

function getDailyTip() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return tips[dayOfYear % tips.length];
}

function getRandomTip() {
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
}

document.addEventListener("DOMContentLoaded", () => {
    const tipElement = document.getElementById("tip");
    const newTipBtn = document.getElementById("new-tip-btn");

    tipElement.textContent = getDailyTip();

    newTipBtn.addEventListener("click", () => {
        tipElement.textContent = getRandomTip();
    });
});