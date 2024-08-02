var newImage, showImg;

document.getElementById('imageInput').addEventListener('change', function (event) {
    showImg = document.getElementById('showImg');
    showImg.classList.remove('hidden');
    showImg.src = URL.createObjectURL(event.target.files[0]);

    newImage = document.createElement('img');
    newImage.src = URL.createObjectURL(event.target.files[0]);

    showImg.onload = function () {
        URL.revokeObjectURL(showImg.src); // free memory
    };
});

document.getElementById('download-btn').addEventListener('click', function pdfDown() {
    var { jsPDF } = window.jspdf;
    var doc = new jsPDF();
    doc.addImage(newImage, 'JPEG', 15, 40, 180, 180);
    doc.save('ImgToPDF.pdf');
});

