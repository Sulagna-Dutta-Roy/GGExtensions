document.getElementById('imageFiles').addEventListener('change', updatePreview);
document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const files = document.getElementById('imageFiles').files;
    const format = document.getElementById('format').value;
    if (files.length === 0) {
        alert('Please upload at least one image.');
        return;
    }
    const convertedFiles = await convertImages(files, format);
    if (convertedFiles.length === 1) {
        downloadFile(convertedFiles[0].data, convertedFiles[0].filename);
    } else {
        const zip = new JSZip();
        convertedFiles.forEach(file => {
            zip.file(file.filename, file.data);
        });
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        downloadFile(zipBlob, 'converted_images.zip');
    }
});

async function convertImages(files, format) {
    const convertedFiles = [];
    for (const file of files) {
        const img = await loadImage(file);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        let dataUrl = '';
        if (format === 'ico') {
            dataUrl = await convertToIco(canvas);
        } else {
            dataUrl = canvas.toDataURL(`image/${format}`);
        }
        const blob = await dataUrlToBlob(dataUrl);
        const filename = file.name.replace(/\.[^/.]+$/, "") + '.' + format;
        convertedFiles.push({ filename, data: blob });
    }
    return convertedFiles;
}

function loadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                resolve(img);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function dataUrlToBlob(dataUrl) {
    return fetch(dataUrl).then(res => res.blob());
}

function downloadFile(blob, filename) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function convertToIco(canvas) {
    const iconSizes = [16, 32, 48, 64, 128, 256];
    const iconCanvas = document.createElement('canvas');
    const iconCtx = iconCanvas.getContext('2d');
    const images = await Promise.all(iconSizes.map(size => {
        iconCanvas.width = size;
        iconCanvas.height = size;
        iconCtx.drawImage(canvas, 0, 0, size, size);
        return dataUrlToBlob(iconCanvas.toDataURL('image/png'));
    }));
    const icoBlob = await createIco(images);
    return URL.createObjectURL(icoBlob);
}

async function createIco(images) {
    const icoData = [0, 0, 1, 0, images.length];
    let imageData = [];
    let imageOffset = 6 + (16 * images.length);
    for (const image of images) {
        const size = await image.size;
        icoData.push(image.width, image.height, 0, 0, 1, 32, size, imageOffset);
        imageOffset += size;
        const buffer = await image.arrayBuffer();
        imageData.push(new Uint8Array(buffer));
    }
    const header = new Uint8Array(icoData.flat());
    const icoBlob = new Blob([header, ...imageData], { type: 'image/x-icon' });
    return icoBlob;
}

function updatePreview() {
    const preview = document.getElementById('preview');
    preview.innerHTML = '';
    const files = document.getElementById('imageFiles').files;
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const div = document.createElement('div');
        div.className = 'preview-item';
  
        const img = document.createElement('img');
        img.src = e.target.result;
  
        const fileName = document.createElement('span');
        fileName.className = 'file-name';
        fileName.textContent = file.name;
  
        const imageType = document.createElement('span');
        imageType.className = 'image-type';
        imageType.textContent = file.type.split('/')[1];
  
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-times-circle delete-icon'; // Assuming Font Awesome
  
        deleteIcon.addEventListener('click', () => {
          preview.removeChild(div);
          const updatedFiles = Array.from(files).filter(f => f !== file);
          document.getElementById('imageFiles').files = updatedFiles;
        });
  
        div.appendChild(img);
        div.appendChild(fileName);
        div.appendChild(imageType);
        div.appendChild(deleteIcon);
        preview.appendChild(div);
      };
      reader.readAsDataURL(file);
    }
  }