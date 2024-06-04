function countWords() {
    const text = document.getElementById('text-input').value.trim();
    const wordCount = text === '' ? 0 : text.split(/\s+/).length;
    document.getElementById('word-count').innerText = wordCount;
}