document.getElementById('analyze-btn').addEventListener('click', analyzeSEO);

async function analyzeSEO() {
    const url = document.getElementById('url-input').value;
    if (!url) {
        alert('Please enter a URL');
        return;
    }

    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const rawResponse = await response.text();
        console.log('Raw response:', rawResponse);

        const data = JSON.parse(rawResponse);

        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');

        const title = doc.querySelector('title') ? doc.querySelector('title').innerText : 'No title found';
        
        const metaDescription = doc.querySelector('meta[name="description"]') 
            ? doc.querySelector('meta[name="description"]').getAttribute('content') 
            : 'No meta description found';

        const h1 = doc.querySelector('h1') ? doc.querySelector('h1').innerText : 'No H1 tag found';

        const wordCount = doc.body.innerText.split(/\s+/).filter(Boolean).length;

        document.querySelector('#title-tag span').innerText = title;
        document.querySelector('#meta-description span').innerText = metaDescription;
        document.querySelector('#h1-tag span').innerText = h1;
        document.querySelector('#word-count span').innerText = wordCount;

    } catch (error) {
        console.error('Error fetching or processing the URL:', error);
        alert('Failed to fetch the URL or process the content. Please check the console for more details.');
    }
}
