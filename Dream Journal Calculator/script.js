document.getElementById('dreamForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('dreamTitle').value;
    const date = document.getElementById('dreamDate').value;
    const entry = document.getElementById('dreamEntry').value;
    const emotions = document.getElementById('dreamEmotions').value.split(',').map(e => e.trim());

    const words = extractKeywords(entry);
    displayWordCloud(words);
    displayAnalysis(words, emotions);
});

function extractKeywords(text) {
    const stopwords = ["I", "was", "and", "the", "a", "to", "in", "of", "that", "it"];
    const words = text.split(/\W+/).filter(word => !stopwords.includes(word.toLowerCase()));
    const wordCount = {};

    words.forEach(word => {
        word = word.toLowerCase();
        wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return Object.entries(wordCount).map(([word, size]) => ({ word, size }));
}

function displayWordCloud(words) {
    const wordCloudData = words.map(({ word, size }) => [word, size * 10]);
    WordCloud(document.getElementById('wordCloud'), { list: wordCloudData });
}

function displayAnalysis(words, emotions) {
    const analysisDiv = document.getElementById('analysis');
    analysisDiv.innerHTML = '';

    const recurringWords = words.filter(({ size }) => size > 1).map(({ word }) => word);
    const emotionList = emotions.join(', ');

    const recurringWordsElement = document.createElement('p');
    recurringWordsElement.textContent = `Recurring words: ${recurringWords.join(', ')}`;
    analysisDiv.appendChild(recurringWordsElement);

    const emotionElement = document.createElement('p');
    emotionElement.textContent = `Emotions: ${emotionList}`;
    analysisDiv.appendChild(emotionElement);
}
