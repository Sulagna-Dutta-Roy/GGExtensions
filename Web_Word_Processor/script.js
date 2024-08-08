// Initialize Quill editor
function initializeEditor(selector) {
    return new Quill(selector, {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'font': [] }],
                ['bold', 'italic', 'underline'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                ['image']
            ]
        }
    });
}

let editors = [];
editors.push(initializeEditor('#editor-container'));

// Handle Font Family Change
document.getElementById('font-family').addEventListener('change', function () {
    const font = this.value;
    const editor = editors[editors.length - 1];
    editor.format('font', font);
});

// Handle Background Color Change
document.getElementById('background-color').addEventListener('input', function () {
    document.getElementById('editor-container').style.backgroundColor = this.value;
});

// Handle Font Color Change
document.getElementById('font-color').addEventListener('input', function () {
    const color = this.value;
    const editor = editors[editors.length - 1];
    editor.format('color', color);
});

// Handle Page Size Change
document.getElementById('page-width').addEventListener('input', function () {
    document.getElementById('editor-container').style.width = `${this.value}px`;
});
document.getElementById('page-height').addEventListener('input', function () {
    document.getElementById('editor-container').style.height = `${this.value}px`;
});

// Insert Image Functionality
function insertImage() {
    const imageUrl = prompt("Enter the URL of the image:");
    if (imageUrl) {
        const width = prompt("Enter the image width (px):", "200");
        const height = prompt("Enter the image height (px):", "200");

        if (width && height) {
            const editor = editors[editors.length - 1];
            const range = editor.getSelection();
            const imgHtml = `<img src="${imageUrl}" width="${width}" height="${height}">`;
            editor.clipboard.dangerouslyPasteHTML(range.index, imgHtml);

            // Add event listener to resize the image on click
            setTimeout(() => {
                const imgs = document.querySelectorAll('img');
                imgs.forEach(img => {
                    img.addEventListener('click', function () {
                        const newWidth = prompt("Enter new image width (px):", img.width);
                        const newHeight = prompt("Enter new image height (px):", img.height);
                        if (newWidth && newHeight) {
                            img.width = newWidth;
                            img.height = newHeight;
                        }
                    });
                });
            }, 10); // Delay to allow the image to be inserted first
        } else {
            alert("Image insertion canceled. Please provide valid dimensions.");
        }
    }
}

// Export as PDF
function exportPDF() {
    editors.forEach((editor, index) => {
        const content = editor.root;
        html2pdf().from(content).set({
            margin: 1,
            filename: `document_sheet_${index + 1}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        }).save();
    });
}

// Export as PPT
function exportPPT() {
    let pptx = new PptxGenJS();
    editors.forEach((editor, index) => {
        let slide = pptx.addSlide();
        slide.addText(editor.root.innerHTML, { x: 0.5, y: 0.5, w: '90%', h: '90%' });
    });
    pptx.writeFile('document.pptx');
}

// Add New Sheet Functionality
function addSheet() {
    const pageWidth = prompt("Enter the width of the new sheet (px):", 800);
    const pageHeight = prompt("Enter the height of the new sheet (px):", 600);

    const newSheet = document.createElement('div');
    newSheet.className = 'editor-container';
    newSheet.style.width = `${pageWidth}px`;
    newSheet.style.height = `${pageHeight}px`;

    document.body.appendChild(newSheet);
    editors.push(initializeEditor(newSheet));
}
