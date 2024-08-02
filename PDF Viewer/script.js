document.addEventListener('DOMContentLoaded', function() {
    var pdfInput = document.getElementById('pdfInput');
    var pdfFrame = document.getElementById('pdfFrame');

    pdfInput.addEventListener('change', function(event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function() {
                var pdfData = reader.result;
                localStorage.setItem('pdfData', pdfData); 
                pdfFrame.src = pdfData; 
            }
            reader.readAsDataURL(file);
        }
    });

    var storedPdfData = localStorage.getItem('pdfData');
    if (storedPdfData) {
        pdfFrame.src = storedPdfData;
    }
});
