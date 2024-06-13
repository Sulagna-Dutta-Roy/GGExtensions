const imageWrapper = document.querySelector(".images");
const searchInput = document.querySelector(".search input[type='text']");
const searchButton = document.querySelector(".search-btn");
const loadMoreBtn = document.querySelector(".load-more");
const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox.querySelector("img");
const lightboxTitle = lightbox.querySelector(".photo-title");
const closeIcon = lightbox.querySelector(".close-icon");

const apiKey = "8UlytL660WproZ8seBUDTq7AbBjiRzjGK9SWBAS1tyAtiAelFObfBna6";
const perPage = 15;
let currentPage = 1;
let searchTerm = "";

const fetchImages = async (url) => {
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: apiKey
            }
        });
        const data = await response.json();
        return data.photos;
    } catch (error) {
        console.error("Error fetching images:", error);
        return [];
    }
};

const displayImages = (images) => {
    images.forEach((image) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const img = document.createElement("img");
        img.src = image.src.medium;
        img.alt = image.photographer;

        const details = document.createElement("div");
        details.classList.add("details");

        const photographer = document.createElement("div");
        photographer.classList.add("photographer");
        photographer.innerHTML = `<i class="uil uil-camera"></i> <span>${image.photographer}</span>`;

        const downloadButton = document.createElement("button");
        downloadButton.innerHTML = `<i class="uil uil-download-alt"></i> Download`;
        downloadButton.classList.add("download-btn");
        downloadButton.addEventListener("click", () => downloadImage(image.src.original));

        const openInTabButton = document.createElement("button");
        openInTabButton.innerHTML = `<i class="uil uil-external-link-alt"></i> Open in New Tab`;
        openInTabButton.classList.add("open-in-tab-btn");
        openInTabButton.addEventListener("click", () => openInNewTab(image.src.original));

        details.appendChild(photographer);
        details.appendChild(downloadButton);
        details.appendChild(openInTabButton);

        card.appendChild(img);
        card.appendChild(details);

        imageWrapper.appendChild(card);
    });
};

const loadMoreImages = () => {
    currentPage++;
    const apiUrl = searchTerm ?
        `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` :
        `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    fetchAndDisplay(apiUrl);
};

const fetchAndDisplay = async (url) => {
    try {
        const images = await fetchImages(url);
        if (images.length === 0) {
            imageWrapper.innerHTML = '<li class="not-available">Images Not Available</li>';
            loadMoreBtn.classList.add("disabled");
        } else {
            displayImages(images);
            loadMoreBtn.classList.remove("disabled");
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        imageWrapper.innerHTML = '<li class="not-available">Error Fetching Images</li>';
        loadMoreBtn.classList.add("disabled");
    }
};

const searchImages = () => {
    currentPage = 1;
    imageWrapper.innerHTML = ""; 
    const query = searchInput.value.trim();
    searchTerm = query;
    const apiUrl = `https://api.pexels.com/v1/search?query=${query}&page=${currentPage}&per_page=${perPage}`;
    fetchAndDisplay(apiUrl);
};

const downloadImage = (imageUrl) => {
    fetch(imageUrl, {
        headers: {
            Authorization: apiKey
        }
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'downloaded-image.jpg';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => console.error('Error downloading image:', error));
};

const openInNewTab = (url) => {
    window.open(url, '_blank');
};

const showLightbox = (imgUrl, title) => {
    lightboxImg.src = imgUrl;
    lightboxTitle.textContent = title;
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
};

const hideLightbox = () => {
    lightbox.classList.remove("show");
    document.body.style.overflow = "auto";
};

searchButton.addEventListener("click", searchImages);
loadMoreBtn.addEventListener("click", loadMoreImages);
closeIcon.addEventListener("click", hideLightbox);

fetchAndDisplay(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
