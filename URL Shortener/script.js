document.getElementById("shorten-btn").addEventListener("click", async () => {
  const urlInput = document.getElementById("url-input").value.trim();
  if (urlInput) {
    const apiUrl = "https://spoo-me-url-shortener.p.rapidapi.com/";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "X-RapidAPI-Key": "a9691f48eemsh89135388428c926p181a59jsn952d884f92e7",
        "X-RapidAPI-Host": "spoo-me-url-shortener.p.rapidapi.com",
      },
      body: new URLSearchParams({
        url: urlInput,
      }),
    };

    try {
      const response = await fetch(apiUrl, options);
      const result = await response.json();
      console.log("API response:", result); // Log the response for debugging

      if (result && result.short_url) {
        const shortUrl = result.short_url;
        document.getElementById("short-url").textContent = shortUrl;
        document.getElementById("result").classList.remove("hidden");
      } else {
        alert("Error shortening URL: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error shortening URL: " + error.message);
    }
  } else {
    alert("Please enter a valid URL.");
  }
});

document.getElementById("copy-btn").addEventListener("click", () => {
  const shortUrl = document.getElementById("short-url").textContent;
  navigator.clipboard
    .writeText(shortUrl)
    .then(() => {
      alert("URL copied to clipboard!");
    })
    .catch((err) => {
      console.error("Could not copy text: ", err);
      alert("Failed to copy URL.");
    });
});

document.getElementById("share-btn").addEventListener("click", () => {
  const shortUrl = document.getElementById("short-url").textContent;
  if (navigator.share) {
    navigator
      .share({
        title: "Check out this URL",
        url: shortUrl,
      })
      .catch((error) => console.error("Error sharing:", error));
  } else {
    alert("Sharing not supported on this browser");
  }
});
