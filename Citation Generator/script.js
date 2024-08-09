document.getElementById('citation-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const author = document.getElementById('author').value;
    const title = document.getElementById('title').value;
    const publisher = document.getElementById('publisher').value;
    const year = document.getElementById('year').value;

    const citation = `${author}. (${year}). *${title}*. ${publisher}.`;

    document.getElementById('citation').textContent = citation;

});