
    const editor = document.getElementById('editor');

    document.getElementById('font-family').addEventListener('change', function() {
        document.execCommand('fontName', false, this.value);
    });

    document.getElementById('font-size').addEventListener('change', function() {
        document.execCommand('fontSize', false, '7');
        editor.style.fontSize = this.value;
    });

    document.getElementById('text-color').addEventListener('input', function() {
        document.execCommand('foreColor', false, this.value);
    });

    document.getElementById('background-color').addEventListener('input', function() {
        editor.style.backgroundColor = this.value;
    });

    function addImage() {
        document.getElementById('fileInput').click();
    }

    function addSheet() {
        const width = prompt("Enter the width of the new sheet in pixels:", "800");
        const height = prompt("Enter the height of the new sheet in pixels:", "1200");

        if (width && height) {
            const newSheet = document.createElement('div');
            newSheet.className = 'editor';
            newSheet.contentEditable = true;
            newSheet.innerText = 'Start typing here...';
            newSheet.style.width = width + 'px';
            newSheet.style.height = height + 'px';

            document.getElementById('editor-container').appendChild(newSheet);
        } else {
            alert("Invalid input. Please enter numeric values for width and height.");
        }
    }
    document.getElementById('text-align').addEventListener('change', function() {
    document.execCommand('justify' + this.value.charAt(0).toUpperCase() + this.value.slice(1));
});

document.getElementById('list-type').addEventListener('change', function() {
    const selectedValue = this.value;
    if (selectedValue === 'ul') {
        document.execCommand('insertUnorderedList');
    } else if (selectedValue === 'ol') {
        document.execCommand('insertOrderedList');
    } else if (selectedValue === 'star') {
        insertStarList();
    } else {
        // Remove any lists
        document.execCommand('insertUnorderedList');
        document.execCommand('insertOrderedList');
    }
});

function insertStarList() {
    // Custom function to insert a star list
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const ul = document.createElement('ul');
    ul.style.listStyleType = 'none'; // Remove default list styling

    const items = ['★ Item 1', '★ Item 2', '★ Item 3']; // Example star list items
    items.forEach(text => {
        const li = document.createElement('li');
        li.innerText = text;
        ul.appendChild(li);
    });

    range.deleteContents(); // Remove selected text if any
    range.insertNode(ul); // Insert the new list
}

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                editor.appendChild(img);
            }
            reader.readAsDataURL(file);
        }
    }

    function exportPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: [800, 1200]
        });

        doc.html(editor, {
            callback: function(doc) {
                doc.save('document.pdf');
            },
            x: 0,
            y: 0,
            html2canvas: { scale: 1 }
        });
    }

    function exportImage(format) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = editor.offsetWidth;
        canvas.height = editor.offsetHeight;
        ctx.fillStyle = getComputedStyle(editor).backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        html2canvas(editor).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/' + format);
            link.download = 'document.' + format;
            link.click();
        });
    }
