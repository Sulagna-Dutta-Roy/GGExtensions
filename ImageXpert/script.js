
let selectedConversion = 'jpegToPNG';

function changeConversion(conversion) {
    selectedConversion = conversion;
    document.getElementById('selectedConversion').innerText = selectedConversion.replace(/([A-Z])/g, ' $1').trim();
    document.getElementById('fileUpload').value = '';
    document.getElementById('downloadLink').style.display = 'none';
}

async function convertFile() {
    const fileInput = document.getElementById('fileUpload');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please upload a file first!');
        return;
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension === 'pdf' && !selectedConversion.startsWith('pdfTo')) {
        alert('You selected an image conversion. Please upload an image.');
        return;
    } else if (fileExtension !== 'pdf' && selectedConversion.startsWith('pdfTo')) {
        alert('You selected a PDF conversion. Please upload a PDF.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function (event) {
        const dataUrl = event.target.result;

        if (fileExtension === 'pdf') {
            await handlePDFConversion(dataUrl);
        } else {
            const img = new Image();
            img.src = dataUrl;
            img.onload = async function () {
                await handleImageConversion(img);
            };
        }
    };

    reader.readAsDataURL(file);
}

async function handleImageConversion(img) {
    let convertedBlob, outputFormat;

    switch (selectedConversion) {
        case 'jpegToPNG':
            convertedBlob = await convertToCanvasBlob(img, 'image/png');
            outputFormat = 'png';
            break;

        case 'pngToJPEG':
            convertedBlob = await convertToCanvasBlob(img, 'image/jpeg');
            outputFormat = 'jpg';
            break;

        case 'pngToAVIF':
            convertedBlob = await convertToCanvasBlob(img, 'image/avif');
            outputFormat = 'avif';
            break;

        case 'avifToPNG':
            convertedBlob = await convertToCanvasBlob(img, 'image/png');
            outputFormat = 'png';
            break;

        case 'pngToWebP':
            convertedBlob = await convertToCanvasBlob(img, 'image/webp');
            outputFormat = 'webp';
            break;

        case 'webpToPNG':
            convertedBlob = await convertToCanvasBlob(img, 'image/png');
            outputFormat = 'png';
            break;

        case 'jpegToBMP':
            convertedBlob = await convertToCanvasBlob(img, 'image/bmp');
            outputFormat = 'bmp';
            break;

        case 'bmpToJPEG':
            convertedBlob = await convertToCanvasBlob(img, 'image/jpeg');
            outputFormat = 'jpg';
            break;

        case 'imageToPDF':
            convertedBlob = await convertImageToPDF(img);
            outputFormat = 'pdf';
            break;

        default:
            alert('Conversion type not supported!');
            return;
    }

    const downloadLink = document.getElementById('downloadButton');
    downloadLink.href = URL.createObjectURL(convertedBlob);
    downloadLink.download = `converted.${outputFormat}`;
    document.getElementById('downloadLink').style.display = 'block';
}

async function handlePDFConversion(dataUrl) {
    if (selectedConversion === 'pdfToImage') {
        await convertPDFToImage(dataUrl);
    } else {
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.18.0/pdf.worker.min.js';

        const pdf = await pdfjsLib.getDocument(dataUrl).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: context,
            viewport: viewport,
        };

        await page.render(renderContext).promise();

        let outputFormat = 'png';

        if (selectedConversion === 'pdfToPNG') {
            canvas.toBlob(blob => {
                const downloadLink = document.getElementById('downloadButton');
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = `converted.${outputFormat}`;
                document.getElementById('downloadLink').style.display = 'block';
            }, 'image/png');
        } else {
            alert('Conversion type not supported for PDF!');
        }
    }
}

async function convertPDFToImage(dataUrl) {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.18.0/pdf.worker.min.js';

    const pdf = await pdfjsLib.getDocument(dataUrl).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
        canvasContext: context,
        viewport: viewport,
    };

    await page.render(renderContext).promise();

    canvas.toBlob(blob => {
        const downloadLink = document.getElementById('downloadButton');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'converted.png';
        document.getElementById('downloadLink').style.display = 'block';
    }, 'image/png');
}

function convertToCanvasBlob(img, type) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);

        canvas.toBlob(blob => {
            resolve(blob);
        }, type);
    });
}

async function convertImageToPDF(img) {
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({
        orientation: img.width > img.height ? 'l' : 'p',
        unit: 'px',
        format: [img.width, img.height]
    });

    pdf.addImage(img.src, 'PNG', 0, 0, img.width, img.height);
    return pdf.output('blob');
}
