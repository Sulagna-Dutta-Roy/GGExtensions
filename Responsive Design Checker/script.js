document.getElementById('loadButton').addEventListener('click', function() {
    const url = document.getElementById('url').value;
    if (url) {
        document.getElementById('desktop').src = url;
        document.getElementById('tablet').src = url;
        document.getElementById('mobile').src = url;
    } else {
        alert('Please enter a valid URL');
    }
});
