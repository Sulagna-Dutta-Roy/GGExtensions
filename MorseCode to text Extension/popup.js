document.addEventListener('DOMContentLoaded', function() {
    var translateButton = document.getElementById('translateButton');
    var inputText = document.getElementById('inputText');
    var outputText = document.getElementById('outputText');
  
    translateButton.addEventListener('click', function() {
      var input = inputText.value.trim();
      var translated = '';
  
      if (input.startsWith('.') || input.startsWith('-')) {
        translated = morseToText(input);
      } else {
        translated = textToMorse(input);
      }
  
      outputText.textContent = translated;
    });
  });
  
  function textToMorse(text) {
    // Morse code mapping
    var morseCode = {
      'A': '.-',   'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',   'F': '..-.', 'G': '--.',
      'H': '....', 'I': '..',   'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--',   'N': '-.',
      'O': '---',  'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...',  'T': '-',    'U': '..-',
      'V': '...-', 'W': '.--',  'X': '-..-', 'Y': '-.--', 'Z': '--..',
      '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', 
      '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
    };
  
    // Convert text to uppercase and split into characters
    var chars = text.toUpperCase().split('');
  
    // Translate each character to Morse code
    var morse = chars.map(function(char) {
      if (morseCode.hasOwnProperty(char)) {
        return morseCode[char];
      } else {
        return '';
      }
    });
  
    // Join Morse code characters with space
    return morse.join(' ');
  }
  
  function morseToText(morse) {
    // Morse code mapping (reversed)
    var morseCode = {
      '.-': 'A',   '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',   '..-.': 'F', '--.': 'G',
      '....': 'H', '..': 'I',   '.---': 'J', '-.-': 'K', '.-..': 'L', '--': 'M',   '-.': 'N',
      '---': 'O',  '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S',  '-': 'T',    '..-': 'U',
      '...-': 'V', '.--': 'W',  '-..-': 'X', '-.--': 'Y', '--..': 'Z',
      '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4', 
      '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9'
    };
  
    // Split Morse code into words
    var words = morse.trim().split('   ');
  
    // Translate each word to text
    var text = words.map(function(word) {
      // Split word into characters
      var chars = word.split(' ');
  
      // Translate each character to text
      return chars.map(function(char) {
        if (morseCode.hasOwnProperty(char)) {
          return morseCode[char];
        } else {
          return '';
        }
      }).join('');
    }).join(' ');
  
    return text;
  }
  