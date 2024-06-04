const displayedImage = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');

const btn = document.querySelector('button.dark');
const overlay = document.querySelector('.overlay');
const refreshBtn = document.querySelector('.refresh-btn');

const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/random';
const UNSPLASH_API_KEY = 'l3mYhNBaIwOQPVNIBWFLDU5Knqo01DIWmye0Uv-V7N0';
const IMAGE_COUNT = 5;

async function fetchRandomImages() {
    const response = await fetch(`${UNSPLASH_API_URL}?count=${IMAGE_COUNT}&client_id=${UNSPLASH_API_KEY}`);
    const data = await response.json();
    return data.map(image => image.urls.small);
}


function createImageNode(src) {
    const img = document.createElement('img');
    img.setAttribute('src', src);
    img.classList.add('img-thumbnail');
    return img;
}

async function loadImages() {
    const images = await fetchRandomImages();
    images.forEach((imageSrc) => {
        const img = createImageNode(imageSrc);
        thumbBar.appendChild(img);
    });

    if (images.length > 0) {
        displayedImage.src = images[0];
    }
}

thumbBar.addEventListener('click', (e) => {
    if (e.target.nodeName === "IMG") {
        displayedImage.src = e.target.src;
    }
});

btn.addEventListener('click', (e) => {
    if (e.target.className === 'dark') {
        btn.setAttribute('class', 'btn btn-dark light');
        btn.textContent = 'Lighten';
        overlay.style.backgroundColor = 'rgba(2,1,1,0.5)';
    } else {
        btn.setAttribute('class', 'btn btn-light dark');
        btn.textContent = 'Darken';
        overlay.style.backgroundColor = 'rgba(0,0,0,0)';
    }
});

refreshBtn.addEventListener('click', () => {
    location.reload();
});

loadImages();
