document.addEventListener("DOMContentLoaded", () => {
  
  const textarea = document.querySelector("textarea");
  const button = document.querySelector("button");
  let isSpeaking = false;
  let synth;

  const initTextToSpeech = async () => {
    // Check if Speech Synthesis API is supported
    if (!('speechSynthesis' in window)) {
      alert("Your browser does not support the Speech Synthesis API.");
      return;
    }

    synth = window.speechSynthesis;
    const text = textarea.value.trim();

    // Check if there is text to speak
    if (!text) {
      alert("Please enter some text to convert to speech.");
      return;
    }

    // If not speaking and there is text, start speaking
    if (!synth.speaking) {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.onerror = handleSpeechError;
        utterance.onend = () => {
          isSpeaking = false;
          button.innerText = "Convert to Speech";
        };

        synth.speak(utterance);
        isSpeaking = true;
        button.innerText = "Pause";
      } catch (error) {
        handleSpeechError({ error });
      }
    }

    manageSpeechState();
  };

  const handleSpeechError = (event) => {
    console.error("Speech synthesis error:", event.error);
    alert("An error occurred during speech synthesis: " + event.error);
    resetSpeechState();
  };

  const manageSpeechState = () => {
    if (textarea.value.trim().length > 50) {
      if (synth.speaking) {
        button.innerText = "Pause";
      } else {
        button.innerText = "Resume";
      }
    } else {
      resetSpeechState();
    }
  };

  const resetSpeechState = () => {
    isSpeaking = false;
    button.innerText = "Convert to Speech";
  };

  const toggleSpeech = async () => {
    if (isSpeaking) {
      if (synth.paused) {
        synth.resume();
        button.innerText = "Pause";
      } else {
        synth.pause();
        button.innerText = "Resume";
      }
    } else {
      await initTextToSpeech();
    }
  };

  // Add event listener to button
  button.addEventListener("click", toggleSpeech);

  // Periodically check if the speech synthesis has stopped unexpectedly
  setInterval(() => {
    if (synth && !synth.speaking && isSpeaking) {
      resetSpeechState();
    }
  }, 100);
});