document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const audioPlayer = document.getElementById('audioPlayer');
      const objectUrl = URL.createObjectURL(file);
      audioPlayer.src = objectUrl;
      audioPlayer.play();
    }
  });