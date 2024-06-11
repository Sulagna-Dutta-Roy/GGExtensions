document.getElementById('convertBtn').addEventListener('click', () => {
    const text = document.getElementById('textInput').value;
    const aslOutput = document.getElementById('aslOutput');
    aslOutput.innerHTML = '';

    const words = text.split(' ');
    words.forEach((word, index) => {
      const wordContainer = document.createElement('span');
      wordContainer.classList.add('word-container');

      for (let char of word) {
        if (char.match(/[a-z]/i)) {
          const img = document.createElement('img');
          img.src = `asl/${char.toLowerCase()}.jpg`;
          img.alt = char;
          img.classList.add('asl-letter');
          wordContainer.appendChild(img);
        } else {
          wordContainer.appendChild(document.createTextNode(char));
        }
      }

      aslOutput.appendChild(wordContainer);

      if (index < words.length - 1) {
        aslOutput.appendChild(document.createTextNode(' '));
      }
    });
});
