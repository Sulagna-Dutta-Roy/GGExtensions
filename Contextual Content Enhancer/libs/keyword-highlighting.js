function highlightKeywords(keywords) {
    const content = document.body.innerHTML;
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        document.body.innerHTML = content.replace(regex, `<mark>${keyword}</mark>`);
    });
}