document.getElementById('resizeButton').addEventListener('click', function() {
    var fileInput = document.getElementById('fileInput');
    var widthInput = document.getElementById('widthInput').value;
    var heightInput = document.getElementById('heightInput').value;
    var output = document.getElementById('output');

    if (fileInput.files.length === 0) {
        output.innerHTML = '<p class="error">Please select an image.</p>';
        return;
    }

    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
        var img = new Image();
        img.onload = function() {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = widthInput;
            canvas.height = heightInput;
            ctx.drawImage(img, 0, 0, widthInput, heightInput);
            var dataUrl = canvas.toDataURL('image/png');
            var downloadLink = document.getElementById('downloadLink');
            downloadLink.href = dataUrl;
            downloadLink.style.display = 'block';
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
});
