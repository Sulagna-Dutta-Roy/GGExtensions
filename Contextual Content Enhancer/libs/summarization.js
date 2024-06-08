async function summarizeText(text) {
    // Placeholder summarization API URL
    const apiUrl = `https://api.example.com/summarize`;

    try {
        let response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text })
        });
        if (response.ok) {
            let result = await response.json();
            return result.summary;
        } else {
            throw new Error('Summarization API error');
        }
    } catch (error) {
        console.error("Summarization error: " + error.message);
        return text;  // Return original text on error
    }
}