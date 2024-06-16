document.addEventListener("DOMContentLoaded", function () {
    const placeInput = document.getElementById("placeInput");
    const dateInput = document.getElementById("dateInput");
    const submitButton = document.getElementById("submitButton");
    const resultContainer = document.getElementById("resultContainer");

    submitButton.addEventListener("click", async function () {
        const placeName = placeInput.value.trim();
        const selectedDate = dateInput.value;

        if (!placeName) {
            alert("Please enter a place name.");
            return;
        }

        try {
            // Fetch latitude and longitude from OpenCage Geocoding API
            const geocodingApiEndpoint = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(placeName)}&key=187e0d227af54ecfb1872c0854df4ce6`;
            const geocodingResponse = await fetch(geocodingApiEndpoint);
            const geocodingData = await geocodingResponse.json();

            if (geocodingData.results.length > 0) {
                const { lat, lng } = geocodingData.results[0].geometry;

                // Fetch sunrise and sunset times using latitude, longitude, and date
                const sunriseSunsetApiEndpoint = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${selectedDate}&formatted=0`;
                const sunriseSunsetResponse = await fetch(sunriseSunsetApiEndpoint);
                const sunriseSunsetData = await sunriseSunsetResponse.json();

                if (sunriseSunsetData.status === "OK") {
                    const sunrise = new Date(sunriseSunsetData.results.sunrise).toLocaleTimeString();
                    const sunset = new Date(sunriseSunsetData.results.sunset).toLocaleTimeString();

                    resultContainer.innerHTML = `
                        <h2>Sunrise:</h2>
                        <p>${sunrise}</p>
                        <h2>Sunset:</h3>
                        <p>${sunset}</p>
                    `;
                } else {
                    resultContainer.innerHTML = "<p>Unable to fetch sunrise and sunset times. Please try again later.</p>";
                }
            } else {
                resultContainer.innerHTML = "<p>Location not found. Please enter a valid place name.</p>";
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            resultContainer.innerHTML = "<p>An error occurred. Please try again later.</p>";
        }
    });
});