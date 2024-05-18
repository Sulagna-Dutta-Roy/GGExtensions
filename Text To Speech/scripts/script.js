document.addEventListener("DOMContentLoaded", () => {
  // Get references to the textarea and buttons
  const textarea = document.querySelector("textarea");
  const convertButton = document.getElementById("convertButton");
  const pauseButton = document.getElementById("pauseButton");
  const resumeButton = document.getElementById("resumeButton");
  
  // Initialize state variables
  let isSpeaking = false;
  let synth = window.speechSynthesis;
  let utterance;

  // Initialize and start the text-to-speech process
  const initTextToSpeech = () => {
    // Check if the Speech Synthesis API is supported
    if (!('speechSynthesis' in window)) {
      alert("Your browser does not support the Speech Synthesis API.");
      return;
    }

    // Get the text from the textarea
    const text = textarea.value.trim();
    
    // Check if there is text to speak
    if (!text) {
      alert("Please enter some text to convert to speech.");
      return;
    }

    // Start speaking if not already speaking
    if (!synth.speaking) {
      try {
        // Create a new SpeechSynthesisUtterance with the text
        utterance = new SpeechSynthesisUtterance(text);

        // Handle errors during speech synthesis
        utterance.onerror = handleSpeechError;

        // Handle the end of the speech synthesis
        utterance.onend = () => {
          isSpeaking = false;
          convertButton.innerText = "Convert to Speech";
          console.log("Speech synthesis finished.");
        };

        // Start speaking the utterance
        synth.speak(utterance);
        isSpeaking = true;
        convertButton.innerText = "Speaking";
        console.log("Started speaking:", text);
      } catch (error) {
        handleSpeechError({ error });
      }
    }
  };

  // Handle speech synthesis errors
  const handleSpeechError = (event) => {
    console.error("Speech synthesis error:", event.error || event);
    alert("An error occurred during speech synthesis: " + (event.error || event));
    resetSpeechState();
  };

  // Reset the speech state and update the button text
  const resetSpeechState = () => {
    isSpeaking = false;
    convertButton.innerText = "Convert to Speech";
  };

  // Pause the speech synthesis
  const pauseSpeech = () => {
    if (synth.speaking && !synth.paused) {
      synth.pause();
      convertButton.innerText = "Paused...";
      console.log("Paused speech synthesis.");
    }
  };

  // Resume the speech synthesis
  const resumeSpeech = () => {
    if (synth.paused) {
      synth.resume();
      convertButton.innerText = "Speaking...";
      console.log("Resumed speech synthesis.");
    }
  };

  // Add event listener to the convert button to start speech synthesis
  convertButton.addEventListener("click", () => {
    if (!isSpeaking) {
      initTextToSpeech();
    }
  });

  // Add event listener to the pause button to pause speech synthesis
  pauseButton.addEventListener("click", pauseSpeech);

  // Add event listener to the resume button to resume speech synthesis
  resumeButton.addEventListener("click", resumeSpeech);

  // Periodically check if the speech synthesis has stopped unexpectedly
  setInterval(() => {
    if (synth && !synth.speaking && isSpeaking) {
      resetSpeechState();
    }
  }, 100);
});
