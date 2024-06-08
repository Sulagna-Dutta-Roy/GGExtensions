async function translateText(text, targetLanguage) {
    // Placeholder translation API URL
    const apiUrl = `https://api.example.com/translate?text=${encodeURIComponent(text)}&to=${targetLanguage}`;

    try {
        let response = await fetch(apiUrl);
        if (response.ok) {
            let result = await response.json();
            return result.translatedText;
        } else {
            throw new Error('Translation API error');
        }
    } catch (error) {
        console.error("Translation error: " + error.message);
        return text;  // Return original text on error
    }
}