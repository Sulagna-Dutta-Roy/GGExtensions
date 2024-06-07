const map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

let currentLocationMarker = null;
let directionsLayer = null;

// Check for service worker support
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('scripts/sw.js').then(function () {
        console.log('Service Worker Registered');
    });
}

function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            }, () => {
                reject(new Error('Geolocation not supported or permission denied'));
            });
        } else {
            reject(new Error('Geolocation not supported by this browser'));
        }
    });
}

async function useCurrentLocation() {
    try {
        const userLocation = await getUserLocation();
        document.getElementById('origin').value = `${userLocation.lat}, ${userLocation.lng}`;
    } catch (error) {
        console.error('Error getting user location:', error);
    }
}

async function getDirections() {
    const travelMode = document.getElementById('travel-mode').value;
    const originInput = document.getElementById('origin').value;
    const destinationInput = document.getElementById('destination').value;

    const [originLat, originLng] = originInput.split(',').map(Number);
    const [destinationLat, destinationLng] = destinationInput.split(',').map(Number);

    const origin = { lat: originLat, lng: originLng };
    const destination = { lat: destinationLat, lng: destinationLng };

    if (currentLocationMarker) {
        map.removeLayer(currentLocationMarker);
    }

    currentLocationMarker = L.marker([origin.lat, origin.lng]).addTo(map)
        .bindPopup('Origin')
        .openPopup();

    if (directionsLayer) {
        map.removeLayer(directionsLayer);
    }

    const directions = await fetchDirections(origin, destination, travelMode);

    directionsLayer = L.geoJSON(directions).addTo(map);

    map.setView([origin.lat, origin.lng], 13);
}

async function fetchDirections(start, end, mode) {
    const url = `https://router.project-osrm.org/route/v1/${mode}/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;

    const response = await fetch(url);
    const data = await response.json();

    return data.routes[0].geometry;
}
