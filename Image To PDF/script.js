document.getElementById('imageInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        const img = document.getElementById('showImg');
        img.src = reader.result;
        img.classList.remove('hidden');
    };

    if (file) {
        reader.readAsDataURL(file);
    }
});

document.getElementById('download-btn').addEventListener('click', function () {
    const img = document.getElementById('showImg');
    if (img.src) {
        const pdf = new jsPDF();
        pdf.addImage(img.src, 'JPEG', 10, 10, 180, 180);
        pdf.save('converted.pdf');
    } else {
        alert('Please upload an image first.');
    }
});
