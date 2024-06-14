document.addEventListener("DOMContentLoaded", () => {
  function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    document.getElementById("time").textContent = `${hours}:${minutes}`;
  }

  function updateWeather() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

          fetch(url)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              const temp = data.main.temp;
              const weatherDescription = data.weather[0].description;
              document.getElementById(
                "weather"
              ).textContent = `${temp}°C, ${weatherDescription}`;
            })
            .catch((error) => {
              console.error("Error fetching weather data:", error);
              document.getElementById("weather").textContent =
                "Enable Location for weather data.";
            });
        },
        (error) => {
          console.error("Geolocation error:", error);
          document.getElementById("weather").textContent =
            "Unable to retrieve location.";
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      document.getElementById("weather").textContent =
        "Geolocation is not supported by this browser.";
    }
  }

  updateTime();
  updateWeather();
  setInterval(updateTime, 60000); // Update time every minute
});
