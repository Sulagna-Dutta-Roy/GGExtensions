document.getElementById('convertButton').addEventListener('click', function() {
    const videoInput = document.getElementById('videoInput').files[0];

    if (!videoInput) {
        alert('Please select a video file first!');
        return;
    }

    const videoElement = document.createElement('video');
    videoElement.src = URL.createObjectURL(videoInput);
    videoElement.load();

    videoElement.addEventListener('loadedmetadata', function() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(videoElement);
        const destination = audioContext.createMediaStreamDestination();

        source.connect(destination);
        source.connect(audioContext.destination);

        const audioChunks = [];
        const mediaRecorder = new MediaRecorder(destination.stream);

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = audioUrl;
            downloadLink.download = 'extracted_audio.mp3';
            downloadLink.style.display = 'block';
        };

        mediaRecorder.start();

        videoElement.play();

        videoElement.onended = () => {
            mediaRecorder.stop();
        };
    });
});
