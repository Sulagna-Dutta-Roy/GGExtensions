const formEl = document.querySelector('form');
const ipInputEl = document.getElementById('ip-input');
const ipEl = document.getElementById('ip-info');
const locationEl = document.getElementById('location-info');
const timezoneEl = document.getElementById('timezone-info');
const ispEl = document.getElementById('isp-info');

const modal = document.getElementById('modal');
const errorMsgEl = document.getElementById('error-message');
const closeBtn = document.getElementById('close-btn');

const map = L.map('map').setView([0, 0], 13);
const tileUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2V2ZXRpaDg2MSIsImEiOiJja2h4MzFxaG8wOW5pMzBsdGZ1NXFoeHh5In0.hw5mLyF4KWalDgcxAWrmuw';

L.tileLayer(tileUrl, {
    maxZoom: 18,
    attribution: false,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

const locationIcon = L.icon({
    iconUrl: 'images/icon-location.svg',
    iconSize: [35, 35],
    iconAnchor: [15, 15]
});

const marker = L.marker([0, 0], {icon: locationIcon}).addTo(map);

formEl.onsubmit = (e) => {
    e.preventDefault();
    
    fetch(`https://ipapi.co/${ipInputEl.value}/json/`)
        .then(res => res.json())
        .then(data => renderResults(data))
        .catch(error => displayError(error));
    
    e.target.reset();
}

fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(data => renderResults(data))
    .catch(error => displayError(error));

function renderResults(data) {
    if (data.error) {
        throw(`${data.reason}`);
    }
    ipEl.textContent = data.ip;
    locationEl.textContent = `${data.city}, ${data.region}, ${data.country_name}`;
    if (data.utc_offset !== null) {
        timezoneEl.textContent = 'UTC: ' + data.utc_offset.slice(0, 3) + ':' + data.utc_offset.slice(3);
    }
    else {
        timezoneEl.textContent = data.timezone;
    }
    ispEl.textContent = data.org;
    map.setView([data.latitude, data.longitude], 13);
    marker.setLatLng([data.latitude, data.longitude]);
    marker.bindPopup(`<b>${data.ip}</b>`).openPopup();
}

function displayError(e) {
    errorMsgEl.textContent = e;
    modal.showModal();
}

closeBtn.onclick = () => {
    modal.close();
}