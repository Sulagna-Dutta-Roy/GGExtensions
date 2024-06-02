
const img_url = document.querySelector('#img-url'),
    upload_file_btn = document.querySelector('#upload-file-btn'),
    copy_text = document.querySelector('#copy-text'),
    img_result = document.querySelector('#img-result'),
    converted_text = document.querySelector('#converted-text');


img_url.onclick = () => {
    img_url.select();
}

copy_text.onclick = () => {
    copy_text.setAttribute('title', "Copied.");
    setTimeout(() => {
        copy_text.setAttribute('title', "Copy text.");
    }, 2000);

    if (converted_text.value != '') {
        navigator.clipboard.writeText(converted_text.value);
    }
}

img_url.addEventListener('change', createFile);
upload_file_btn.addEventListener('change', displayImage);

async function createFile() {
    if (this.value != '') {
        img_result.src = this.value;

        await fetch(this.value)
            .then(res => res.blob())
            .then(blob_file => {
                let file = new File([blob_file], blob_file.name, { type: blob_file.type });
                recognizeText(file);
            })

    }
}

function displayImage() {
    const reader = new FileReader();
    reader.onload = () => {
        img_result.src = reader.result;
    }
    reader.readAsDataURL(this.files[0]);
    recognizeText(this.files[0]);
}

function recognizeText(file) {
    Tesseract.recognize(file)
        .then(result => {
            converted_text.value = result.text;
        })
}