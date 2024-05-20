document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startButton");
    const resultDiv = document.getElementById("result");

    startButton.addEventListener("click", function () {
        const fileSize = 20 * 1024 * 1024; // 50 MB file
        const numParallelRequests = 5; // Number of parallel requests
        let totalSpeed = 0;

        const fetchAndMeasureSpeed = async () => {
            const startTime = performance.now();
            const url = "data:application/octet-stream;base64," + "A".repeat(fileSize);
            try {
                const response = await fetch(url);
                const endTime = performance.now();
                const duration = (endTime - startTime) / 1000; // in seconds
                const speedMbps = (fileSize * 8) / (duration * 1024 * 1024); // Mbps
                return speedMbps;
            } catch (error) {
                console.error("Error fetching data:", error);
                return 0;
            }
        };

        const requests = Array.from({ length: numParallelRequests }, fetchAndMeasureSpeed);

        Promise.all(requests)
            .then(speeds => {
                speeds.forEach(speed => {
                    totalSpeed += speed;
                });
                const averageSpeed = totalSpeed / numParallelRequests;
                resultDiv.innerText = `Your average network speed is approximately ${averageSpeed.toFixed(2)} Mbps`;
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                resultDiv.innerText = "Error occurred during speed test";
            });
    });
});
